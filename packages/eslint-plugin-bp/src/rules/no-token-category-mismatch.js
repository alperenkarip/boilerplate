/**
 * no-token-category-mismatch
 * bp-* token'larin dogru prefix kategorisiyle kullanilmasini zorunlu kilar.
 * Ornek: bg-bp-content HATA (bp-content text-only, bg- ile kullanilamaz)
 * Ornek: text-bp-canvas HATA (bp-canvas bg-only, text- ile kullanilamaz)
 */

import {
  TEXT_ONLY_TOKENS,
  BG_ONLY_TOKENS,
  BORDER_ONLY_TOKENS,
} from '../utils/token-whitelist.js';

const MESSAGE_TEXT_ONLY =
  '"{{token}}" sadece text- prefix\'i ile kullanilabilir. Hatali kullanim: "{{usage}}".';

const MESSAGE_BG_ONLY =
  '"{{token}}" sadece bg- prefix\'i ile kullanilabilir. Hatali kullanim: "{{usage}}".';

const MESSAGE_BORDER_ONLY =
  '"{{token}}" sadece border- prefix\'i ile kullanilabilir. Hatali kullanim: "{{usage}}".';

// bp- token'i iceren class regex: (prefix)-(bp-token-name)
const BP_TOKEN_CLASS_REGEX = /(?:^|\s)(?:(?:[\w-]+:)*)(bg|text|border|ring|outline|shadow|accent|caret|fill|stroke|decoration|placeholder|divide|from|via|to)-(bp-[\w-]+)/g;

// Text prefix'leri
const TEXT_PREFIXES = new Set(['text']);

// Background prefix'leri
const BG_PREFIXES = new Set(['bg']);

// Border prefix'leri
const BORDER_PREFIXES = new Set(['border', 'divide']);

/**
 * Class string'ini analiz edip token kategori uyumsuzluklarini tespit eder.
 * @param {string} classStr
 * @returns {{ token: string, usage: string }[]} ihlaller
 */
function findMismatches(classStr) {
  if (!classStr || typeof classStr !== 'string') return [];

  const mismatches = [];
  const classes = classStr.split(/\s+/);

  for (const cls of classes) {
    if (!cls) continue;

    // Variant prefix'lerini strip et (dark:, hover:, ios:, android: vb.)
    const baseClass = cls.replace(
      /^(?:(?:dark|light|hover|focus|active|disabled|ios|android|web|sm|md|lg|xl|2xl):)*/g,
      '',
    );

    // bp- token iceren class'lari bul
    BP_TOKEN_CLASS_REGEX.lastIndex = 0;
    let match;
    while ((match = BP_TOKEN_CLASS_REGEX.exec(baseClass)) !== null) {
      const prefix = match[1];
      const token = match[2];

      // TEXT_ONLY token bg- veya border- ile kullanilirsa hata
      if (TEXT_ONLY_TOKENS.has(token) && !TEXT_PREFIXES.has(prefix)) {
        mismatches.push({ token, usage: `${prefix}-${token}` });
      }

      // BG_ONLY token text- veya border- ile kullanilirsa hata
      if (BG_ONLY_TOKENS.has(token) && !BG_PREFIXES.has(prefix)) {
        mismatches.push({ token, usage: `${prefix}-${token}` });
      }

      // BORDER_ONLY token text- veya bg- ile kullanilirsa hata
      if (BORDER_ONLY_TOKENS.has(token) && !BORDER_PREFIXES.has(prefix)) {
        mismatches.push({ token, usage: `${prefix}-${token}` });
      }
    }
  }

  return mismatches;
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'bp-* token\'larin dogru prefix kategorisiyle kullanilmasini zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      textOnlyMismatch: MESSAGE_TEXT_ONLY,
      bgOnlyMismatch: MESSAGE_BG_ONLY,
      borderOnlyMismatch: MESSAGE_BORDER_ONLY,
    },
  },

  create(context) {
    /**
     * String degerindeki token uyumsuzluklarini raporlar.
     * @param {import('estree').Node} node
     * @param {string} value
     */
    function checkStringValue(node, value) {
      const mismatches = findMismatches(value);

      for (const { token, usage } of mismatches) {
        let messageId = 'textOnlyMismatch';
        if (BG_ONLY_TOKENS.has(token)) messageId = 'bgOnlyMismatch';
        if (BORDER_ONLY_TOKENS.has(token)) messageId = 'borderOnlyMismatch';

        context.report({
          node,
          messageId,
          data: { token, usage },
        });
      }
    }

    return {
      // className="bg-bp-content ..."
      JSXAttribute(node) {
        if (node.name?.name !== 'className') return;

        // String literal
        if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
          checkStringValue(node.value, node.value.value);
          return;
        }

        // JSXExpressionContainer
        if (node.value?.type === 'JSXExpressionContainer') {
          const expr = node.value.expression;

          // Template literal
          if (expr.type === 'TemplateLiteral') {
            for (const quasi of expr.quasis) {
              checkStringValue(node.value, quasi.value.raw);
            }
            return;
          }

          // String literal expression
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            checkStringValue(expr, expr.value);
            return;
          }

          // cn(), clsx(), twMerge() cagrisi
          if (expr.type === 'CallExpression') {
            const callee = expr.callee;
            const helperNames = new Set(['cn', 'clsx', 'twMerge', 'classNames', 'cx']);

            const isHelper =
              (callee.type === 'Identifier' && helperNames.has(callee.name)) ||
              (callee.type === 'MemberExpression' && helperNames.has(callee.property?.name));

            if (isHelper) {
              for (const arg of expr.arguments) {
                if (arg.type === 'Literal' && typeof arg.value === 'string') {
                  checkStringValue(arg, arg.value);
                }
                if (arg.type === 'TemplateLiteral') {
                  for (const quasi of arg.quasis) {
                    checkStringValue(arg, quasi.value.raw);
                  }
                }
              }
            }
          }
        }
      },
    };
  },
};

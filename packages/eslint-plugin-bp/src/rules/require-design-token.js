/**
 * require-design-token
 * className prop'unda Tailwind varsayilan renk class'lari yasaktir.
 * bp- prefix'li design token kullanilmalidir.
 */

import { TEXT_POSITION_CLASSES, EXEMPT_COLOR_NAMES } from '../utils/token-whitelist.js';

// Tailwind varsayilan renk class'i regex:
// bg-red-500, text-blue-100, border-green-300, ring-pink-200 vb.
const TAILWIND_DEFAULT_COLOR_REGEX =
  /(?:^|\s)(?:bg|text|border|ring|outline|shadow|accent|caret|fill|stroke|decoration|placeholder|divide|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{1,3})?\b/g;

const MESSAGE =
  'Tailwind default renk class\'lari yasaktir. bp- onekli token kullanin (orn: bg-bp-primary).';

/**
 * Bir class string'ini ayrıstirarak token ihlallerini tespit eder.
 * @param {string} classStr
 * @returns {boolean} ihlal var mi
 */
function hasDefaultColorClass(classStr) {
  if (!classStr || typeof classStr !== 'string') return false;

  // Variant prefix'lerini temizle (dark:, hover:, ios:, android: vb.)
  const classes = classStr.split(/\s+/);

  for (const cls of classes) {
    if (!cls) continue;

    // Variant prefix'lerini strip et
    const baseClass = cls.replace(
      /^(?:dark|light|hover|focus|active|disabled|ios|android|web|sm|md|lg|xl|2xl):/g,
      '',
    );

    // Pozisyon class'lari istisna
    if (TEXT_POSITION_CLASSES.has(baseClass)) continue;

    // transparent, white, black, inherit istisna
    const parts = baseClass.split('-');
    if (parts.length >= 2) {
      const colorName = parts.slice(1).join('-');
      if (EXEMPT_COLOR_NAMES.has(colorName)) continue;
    }

    // Tailwind varsayilan renk class'i kontrolu
    TAILWIND_DEFAULT_COLOR_REGEX.lastIndex = 0;
    if (TAILWIND_DEFAULT_COLOR_REGEX.test(baseClass)) {
      return true;
    }
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Tailwind varsayilan renk class\'larini yasaklar, bp- onekli design token kullanimi zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      requireDesignToken: MESSAGE,
    },
  },

  create(context) {
    /**
     * String literal degerini kontrol eder.
     * @param {import('estree').Node} node
     * @param {string} value
     */
    function checkStringValue(node, value) {
      if (hasDefaultColorClass(value)) {
        context.report({
          node,
          messageId: 'requireDesignToken',
        });
      }
    }

    return {
      // className="bg-red-500 ..."
      JSXAttribute(node) {
        if (node.name?.name !== 'className') return;

        // String literal
        if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
          checkStringValue(node.value, node.value.value);
          return;
        }

        // JSXExpressionContainer: className={...}
        if (node.value?.type === 'JSXExpressionContainer') {
          const expr = node.value.expression;

          // Template literal: className={`bg-red-500 ${...}`}
          if (expr.type === 'TemplateLiteral') {
            for (const quasi of expr.quasis) {
              checkStringValue(node.value, quasi.value.raw);
            }
            return;
          }

          // String literal expression: className={"bg-red-500"}
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

/**
 * no-hardcoded-spacing
 * Hardcoded bosluk (margin, padding, gap) degerleri yasaktir.
 * Semantic spacing token kullanilmalidir.
 */

import { isInsideAnimatedStyle } from '../utils/ast-helpers.js';
import { EXEMPT_SPACING_VALUES } from '../utils/token-whitelist.js';

// Spacing ile ilgili property isimleri
const SPACING_PROPERTIES = new Set([
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'gap',
  'rowGap',
  'columnGap',
]);

const MESSAGE =
  'Hardcoded bosluk degeri yasaktir. Semantic token kullanin (orn: p-bp-md, mb-bp-lg, gap-bp-xs).';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Hardcoded spacing degerlerini yasaklar, semantic spacing token kullanimi zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          exemptValues: {
            type: 'array',
            items: { type: 'number' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noHardcodedSpacing: MESSAGE,
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const userExemptValues = new Set(options.exemptValues || []);

    // Birlestirilmis istisna listesi
    const exemptValues = new Set([...EXEMPT_SPACING_VALUES, ...userExemptValues]);

    return {
      Property(node) {
        // Sadece spacing property'lerini kontrol et
        if (
          node.key?.type !== 'Identifier' ||
          !SPACING_PROPERTIES.has(node.key.name)
        ) {
          return;
        }

        // Reanimated animated style istisnasi
        if (isInsideAnimatedStyle(node)) return;

        // Numeric literal kontrolu
        if (node.value?.type === 'Literal' && typeof node.value.value === 'number') {
          const val = node.value.value;

          // 0 degeri her zaman istisna (reset spacing)
          if (val === 0) return;

          // Istisna listesindeki degerler
          if (exemptValues.has(val)) return;

          context.report({
            node: node.value,
            messageId: 'noHardcodedSpacing',
          });
        }

        // Negatif deger: UnaryExpression (orn: -16)
        if (
          node.value?.type === 'UnaryExpression' &&
          node.value.operator === '-' &&
          node.value.argument?.type === 'Literal' &&
          typeof node.value.argument.value === 'number'
        ) {
          const val = node.value.argument.value;
          if (exemptValues.has(val)) return;

          context.report({
            node: node.value,
            messageId: 'noHardcodedSpacing',
          });
        }
      },
    };
  },
};

/**
 * no-hardcoded-font-weight
 * fontWeight property'sinde numeric (700, 600) veya string ('bold', 'normal') deger yasaktir.
 * Font token kullanilmalidir.
 */

import { isInsideAnimatedStyle } from '../utils/ast-helpers.js';

const MESSAGE =
  'Hardcoded fontWeight yasaktir. Font token kullanin (orn: font-bp-bold).';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Hardcoded fontWeight degerlerini yasaklar, font token kullanimi zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noHardcodedFontWeight: MESSAGE,
    },
  },

  create(context) {
    return {
      Property(node) {
        // Sadece fontWeight property'sini kontrol et
        if (
          node.key?.type !== 'Identifier' ||
          node.key.name !== 'fontWeight'
        ) {
          return;
        }

        // Reanimated animated style istisnasi
        if (isInsideAnimatedStyle(node)) return;

        // Numeric literal (orn: 700, 600, 400)
        if (
          node.value?.type === 'Literal' &&
          typeof node.value.value === 'number'
        ) {
          context.report({
            node: node.value,
            messageId: 'noHardcodedFontWeight',
          });
          return;
        }

        // String literal (orn: 'bold', 'normal', '700')
        if (
          node.value?.type === 'Literal' &&
          typeof node.value.value === 'string'
        ) {
          context.report({
            node: node.value,
            messageId: 'noHardcodedFontWeight',
          });
        }
      },
    };
  },
};

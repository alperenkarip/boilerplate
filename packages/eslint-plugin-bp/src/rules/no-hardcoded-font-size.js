/**
 * no-hardcoded-font-size
 * fontSize property'sinde numeric deger kullanimi yasaktir.
 * Typography token kullanilmalidir.
 */

import { isInsideAnimatedStyle } from '../utils/ast-helpers.js';

const MESSAGE =
  'Hardcoded fontSize yasaktir. Typography token kullanin (orn: text-bp-body, text-bp-h1).';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Hardcoded fontSize degerlerini yasaklar, typography token kullanimi zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noHardcodedFontSize: MESSAGE,
    },
  },

  create(context) {
    return {
      Property(node) {
        // Sadece fontSize property'sini kontrol et
        if (
          node.key?.type !== 'Identifier' ||
          node.key.name !== 'fontSize'
        ) {
          return;
        }

        // Reanimated animated style istisnasi
        if (isInsideAnimatedStyle(node)) return;

        // Numeric literal
        if (
          node.value?.type === 'Literal' &&
          typeof node.value.value === 'number'
        ) {
          context.report({
            node: node.value,
            messageId: 'noHardcodedFontSize',
          });
        }
      },
    };
  },
};

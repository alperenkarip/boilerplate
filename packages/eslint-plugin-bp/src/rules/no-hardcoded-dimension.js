/**
 * no-hardcoded-dimension
 * width/height property'lerinde hardcoded deger yasaktir.
 * Layout token veya responsive birim kullanilmalidir.
 */

// Istisna icon boyutlari
const EXEMPT_ICON_SIZES = new Set([16, 20, 24, 32, 40, 48]);

const MESSAGE =
  'Hardcoded boyut degeri yasaktir. Layout token veya responsive birim kullanin.';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Hardcoded width/height degerlerini yasaklar, layout token kullanimi ozendirir.',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          exemptSizes: {
            type: 'array',
            items: { type: 'number' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noHardcodedDimension: MESSAGE,
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const userExemptSizes = new Set(options.exemptSizes || []);
    const exemptSizes = new Set([...EXEMPT_ICON_SIZES, ...userExemptSizes]);

    return {
      Property(node) {
        // Sadece width ve height property'lerini kontrol et
        if (
          node.key?.type !== 'Identifier' ||
          (node.key.name !== 'width' && node.key.name !== 'height')
        ) {
          return;
        }

        const value = node.value;

        // 0 degeri istisna
        if (value?.type === 'Literal' && value.value === 0) return;

        // 'auto' degeri istisna
        if (
          value?.type === 'Literal' &&
          typeof value.value === 'string' &&
          value.value === 'auto'
        ) {
          return;
        }

        // Yuzde string'leri istisna (orn: '50%', '100%')
        if (
          value?.type === 'Literal' &&
          typeof value.value === 'string' &&
          value.value.endsWith('%')
        ) {
          return;
        }

        // Icon boyutlari istisna
        if (
          value?.type === 'Literal' &&
          typeof value.value === 'number' &&
          exemptSizes.has(value.value)
        ) {
          return;
        }

        // Numeric hardcoded deger
        if (value?.type === 'Literal' && typeof value.value === 'number') {
          context.report({
            node: value,
            messageId: 'noHardcodedDimension',
          });
        }
      },
    };
  },
};

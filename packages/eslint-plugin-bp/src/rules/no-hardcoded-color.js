/**
 * no-hardcoded-color
 * Hardcoded renk degerleri (hex, rgb, rgba, hsl, hsla, CSS named color) yasaktir.
 * Semantic token kullanilmalidir.
 */

import { isInsideAnimatedStyle, isExceptionFile } from '../utils/ast-helpers.js';
import { CSS_NAMED_COLORS } from '../utils/token-whitelist.js';

// Hex renk regex: #RGB, #RRGGBB, #RGBA, #RRGGBBAA
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

// rgb/rgba/hsl/hsla fonksiyon regex
const COLOR_FUNC_REGEX = /^(?:rgba?|hsla?)\s*\(/i;

// Renk iliskili CSS property isimleri
const COLOR_PROPERTIES = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'shadowColor',
  'tintColor',
  'overlayColor',
  'textDecorationColor',
  'textShadowColor',
]);

/**
 * Bir deger hardcoded renk mi kontrol eder.
 * @param {string} value
 * @param {boolean} allowRgba
 * @returns {boolean}
 */
function isHardcodedColor(value, allowRgba) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim().toLowerCase();

  // Hex renk
  if (HEX_COLOR_REGEX.test(trimmed)) return true;

  // rgb/rgba/hsl/hsla fonksiyonu
  if (COLOR_FUNC_REGEX.test(trimmed)) {
    // allowRgba secenegi aktifse rgba() izin verilir
    if (allowRgba && trimmed.startsWith('rgba')) return false;
    return true;
  }

  // CSS named color
  if (CSS_NAMED_COLORS.has(trimmed)) return true;

  return false;
}

const MESSAGE =
  'Hardcoded renk degeri yasaktir. Semantic token kullanin (orn: bg-bp-surface, text-bp-content).';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Hardcoded renk degerlerini yasaklar, semantic token kullanimi zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowRgba: {
            type: 'boolean',
            default: false,
          },
          exceptions: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noHardcodedColor: MESSAGE,
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowRgba = options.allowRgba || false;
    const exceptions = options.exceptions || [];

    // Varsayilan istisnalar: theme/ dizini
    const defaultExceptions = ['theme/', 'themes/'];
    const allExceptions = [...defaultExceptions, ...exceptions];

    const filename = context.filename;
    if (isExceptionFile(filename, allExceptions)) return {};

    return {
      // StyleSheet.create() ve style objelerindeki property'ler
      Property(node) {
        // Sadece renk property'lerini kontrol et
        if (
          node.key?.type !== 'Identifier' ||
          !COLOR_PROPERTIES.has(node.key.name)
        ) {
          return;
        }

        // Reanimated animated style istisnasi
        if (isInsideAnimatedStyle(node)) return;

        // Literal deger kontrolu
        if (
          node.value?.type === 'Literal' &&
          typeof node.value.value === 'string' &&
          isHardcodedColor(node.value.value, allowRgba)
        ) {
          context.report({
            node: node.value,
            messageId: 'noHardcodedColor',
          });
        }

        // Template literal kontrolu
        if (node.value?.type === 'TemplateLiteral') {
          for (const quasi of node.value.quasis) {
            if (isHardcodedColor(quasi.value.raw, allowRgba)) {
              context.report({
                node: node.value,
                messageId: 'noHardcodedColor',
              });
              break;
            }
          }
        }
      },
    };
  },
};

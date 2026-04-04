/**
 * require-accessibility-props
 * Etkilesimli bilesenlerde accessibilityLabel prop'u zorunlu kilar.
 * Test dosyalari ve built-in a11y iceren wrapper'lar istisna.
 */

import { hasJSXProp, getJSXElementName } from '../utils/ast-helpers.js';

const INTERACTIVE_COMPONENTS = new Set([
  'Pressable',
  'TouchableOpacity',
  'TouchableHighlight',
  'Button',
  'TouchableWithoutFeedback',
]);

// Dahili a11y destegi olan wrapper component'ler
const A11Y_EXCEPTION_COMPONENTS = new Set([
  'AnimatedButton',
  'HapticButton',
  'PressableIcon',
  'SettingsListItem',
  'ListItem',
  'Chip',
]);

const MESSAGE =
  'Etkilesimli bilesenlerde accessibilityLabel prop\'u zorunludur.';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Touchable/Button benzeri component\'lerde accessibilityLabel zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      requireAccessibilityProps: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;

    // Test dosyalari istisna
    if (
      filename.includes('.test.') ||
      filename.includes('.spec.') ||
      filename.includes('__tests__')
    ) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        const elementName = getJSXElementName(node);

        // Sadece etkilesimli component'leri kontrol et
        if (!INTERACTIVE_COMPONENTS.has(elementName)) return;

        // Built-in a11y olan wrapper'lari atla
        if (A11Y_EXCEPTION_COMPONENTS.has(elementName)) return;

        // accessibilityLabel prop'u var mi kontrol et
        if (!hasJSXProp(node, 'accessibilityLabel')) {
          context.report({
            node,
            messageId: 'requireAccessibilityProps',
          });
        }
      },
    };
  },
};

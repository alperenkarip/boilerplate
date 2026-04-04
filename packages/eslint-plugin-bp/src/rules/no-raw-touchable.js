/**
 * no-raw-touchable
 * react-native'den dogrudan Touchable* component kullanimi yasaktir.
 * Button wrapper kullanilmalidir.
 */

import { isFromReactNative, isExceptionFile } from '../utils/ast-helpers.js';

const TOUCHABLE_COMPONENTS = new Set([
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableNativeFeedback',
  'TouchableWithoutFeedback',
]);

const MESSAGE =
  'Dogrudan Touchable kullanimi yasaktir. Button wrapper kullanin.';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'react-native Touchable* dogrudan kullanimini yasaklar, Button wrapper zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noRawTouchable: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;

    // Button wrapper dosyasi istisna
    const exceptions = [
      'components/core/Button',
      'components/core/button',
    ];

    if (isExceptionFile(filename, exceptions)) return {};

    return {
      ImportDeclaration(node) {
        if (!isFromReactNative(node)) return;

        const touchableSpecifiers = node.specifiers.filter(
          (s) =>
            s.type === 'ImportSpecifier' &&
            TOUCHABLE_COMPONENTS.has(s.imported?.name),
        );

        for (const spec of touchableSpecifiers) {
          context.report({
            node,
            messageId: 'noRawTouchable',
            data: { component: spec.imported.name },
          });
        }
      },
    };
  },
};

/**
 * no-raw-pressable
 * react-native'den dogrudan Pressable kullanimi yasaktir.
 * Button wrapper kullanilmalidir.
 */

import { isFromReactNative, isExceptionFile } from '../utils/ast-helpers.js';

const MESSAGE =
  'Dogrudan Pressable kullanimi yasaktir. Button wrapper kullanin (@/components/core/Button).';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'react-native Pressable dogrudan kullanimini yasaklar, Button wrapper zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noRawPressable: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;

    // Button wrapper dosyasi istisna
    const exceptions = [
      'components/core/Button',
      'components/core/button',
    ];

    // components/ dizini (facade layer) istisna
    if (
      filename.includes('components/') &&
      !filename.includes('features/')
    ) {
      return {};
    }

    if (isExceptionFile(filename, exceptions)) return {};

    return {
      ImportDeclaration(node) {
        if (!isFromReactNative(node)) return;

        const specifiers = node.specifiers.filter(
          (s) =>
            s.type === 'ImportSpecifier' && s.imported?.name === 'Pressable',
        );

        if (specifiers.length > 0) {
          context.report({
            node,
            messageId: 'noRawPressable',
          });
        }
      },
    };
  },
};

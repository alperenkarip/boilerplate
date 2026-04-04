/**
 * no-raw-modal
 * react-native'den dogrudan Modal kullanimi yasaktir.
 * AppModal wrapper kullanilmalidir.
 */

import { isFromReactNative, isExceptionFile } from '../utils/ast-helpers.js';

const MESSAGE =
  'Dogrudan react-native Modal kullanimi yasaktir. AppModal wrapper kullanin (@/components/core/Modal)';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'react-native Modal dogrudan kullanimini yasaklar, AppModal wrapper zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noRawModal: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;

    // Modal wrapper dosyasi istisna
    const exceptions = [
      'components/core/Modal',
      'components/core/modal',
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
            s.type === 'ImportSpecifier' && s.imported?.name === 'Modal',
        );

        if (specifiers.length > 0) {
          context.report({
            node,
            messageId: 'noRawModal',
          });
        }
      },
    };
  },
};

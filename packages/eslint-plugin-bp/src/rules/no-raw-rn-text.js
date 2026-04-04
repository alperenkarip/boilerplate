/**
 * no-raw-rn-text
 * react-native'den dogrudan Text import'u ve kullanimi yasaktir.
 * Text wrapper kullanilmalidir.
 */

import { isFromReactNative, isExceptionFile } from '../utils/ast-helpers.js';

const MESSAGE =
  'Dogrudan react-native Text kullanimi yasaktir. Text wrapper kullanin (@/components/core/Text).';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'react-native Text dogrudan kullanimini yasaklar, Text wrapper zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noRawRnText: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;

    // Text wrapper dosyasi istisna
    const exceptions = [
      'components/core/Text',
      'components/core/text',
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

        const textSpecifiers = node.specifiers.filter(
          (s) =>
            s.type === 'ImportSpecifier' && s.imported?.name === 'Text',
        );

        if (textSpecifiers.length > 0) {
          context.report({
            node,
            messageId: 'noRawRnText',
          });
        }
      },
    };
  },
};

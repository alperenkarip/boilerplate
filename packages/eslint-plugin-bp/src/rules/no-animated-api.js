/**
 * no-animated-api
 * react-native Animated API yerine Reanimated v2+ kullanilmalidir.
 * New Architecture (ADR-018) uyumlulugu icin zorunludur.
 */

import { isFromReactNative, isExceptionFile } from '../utils/ast-helpers.js';

const MESSAGE =
  'react-native Animated API yerine Reanimated v2+ kullanin. New Architecture (ADR-018) uyumlulugu icin zorunludur.';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'react-native Animated API kullanimini yasaklar, Reanimated v2+ zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noAnimatedApi: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;

    // components/core/ dizini istisna (wrapper varsa)
    const exceptions = [
      'components/core/',
    ];

    if (isExceptionFile(filename, exceptions)) return {};

    return {
      ImportDeclaration(node) {
        if (!isFromReactNative(node)) return;

        const specifiers = node.specifiers.filter(
          (s) =>
            s.type === 'ImportSpecifier' && s.imported?.name === 'Animated',
        );

        if (specifiers.length > 0) {
          context.report({
            node,
            messageId: 'noAnimatedApi',
          });
        }
      },
    };
  },
};

/**
 * no-direct-vector-icons-import
 * @expo/vector-icons paketinden dogrudan import yasaktir.
 * Icon facade component kullanilmalidir.
 */

import { isExceptionFile } from '../utils/ast-helpers.js';

const MESSAGE =
  'Dogrudan @expo/vector-icons importu yasaktir. Icon facade component kullanin';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        '@expo/vector-icons dogrudan importunu yasaklar, Icon facade zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowTypeImports: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noDirectVectorIconsImport: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;
    const options = context.options[0] || {};
    const allowTypeImports = options.allowTypeImports ?? true;

    // Icon facade dosyalari istisna
    const exceptions = [
      'Icon.tsx',
      'iconResolver.ts',
      'iconResolverMap.ts',
    ];

    // Test dosyalari istisna
    if (
      filename.includes('.test.') ||
      filename.includes('.spec.') ||
      filename.includes('__tests__')
    ) {
      return {};
    }

    if (isExceptionFile(filename, exceptions)) return {};

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // @expo/vector-icons ve @expo/vector-icons/ ile baslayanlari yakala
        if (
          source !== '@expo/vector-icons' &&
          !source.startsWith('@expo/vector-icons/')
        ) {
          return;
        }

        // Type-only import kontrolu
        if (allowTypeImports && node.importKind === 'type') return;

        context.report({
          node,
          messageId: 'noDirectVectorIconsImport',
        });
      },
    };
  },
};

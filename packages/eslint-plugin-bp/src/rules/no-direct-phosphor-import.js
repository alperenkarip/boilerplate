/**
 * no-direct-phosphor-import
 * phosphor-react-native paketinden dogrudan import yasaktir.
 * Icon facade component kullanilmalidir.
 */

import { isExceptionFile } from '../utils/ast-helpers.js';

const MESSAGE =
  'Dogrudan phosphor-react-native importu yasaktir. Icon facade component kullanin (@/components/core/Icon)';

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'phosphor-react-native dogrudan importunu yasaklar, Icon facade zorunlu kilar.',
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
      noDirectPhosphorImport: MESSAGE,
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
      'iconRegistry.ts',
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
        if (node.source.value !== 'phosphor-react-native') return;

        // Type-only import kontrolu
        if (allowTypeImports && node.importKind === 'type') return;

        context.report({
          node,
          messageId: 'noDirectPhosphorImport',
        });
      },
    };
  },
};

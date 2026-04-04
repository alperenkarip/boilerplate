/**
 * no-barrel-import
 * Barrel import (star/index, star/index.ts, star/index.tsx) pattern'leri yasaktir.
 * Dogrudan dosya yolu kullanilmalidir.
 */

const MESSAGE =
  'Barrel import yasaktir. Dogrudan dosya yolunu kullanin.';

// Barrel import pattern regex
const BARREL_IMPORT_REGEX = /\/index(?:\.tsx?|\.jsx?)?$/;

// Istisna path'ler
const DEFAULT_EXCEPTIONS = [
  '/logger',
  '/i18n',
  'packages/', // packages/*/src/index.ts
];

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Barrel import pattern\'lerini yasaklar, dogrudan dosya yolu kullanimi ozendirir.',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
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
      noBarrelImport: MESSAGE,
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const userExceptions = options.exceptions || [];
    const allExceptions = [...DEFAULT_EXCEPTIONS, ...userExceptions];

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Barrel import pattern kontrolu
        if (!BARREL_IMPORT_REGEX.test(source)) return;

        // Istisna path kontrolu
        const isException = allExceptions.some((pattern) =>
          source.includes(pattern),
        );

        if (isException) return;

        context.report({
          node,
          messageId: 'noBarrelImport',
        });
      },
    };
  },
};

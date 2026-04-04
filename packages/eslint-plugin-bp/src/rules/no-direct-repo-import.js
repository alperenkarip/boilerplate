/**
 * no-direct-repo-import
 * TSX dosyalarindan dogrudan repository import'u yasaktir.
 * UseCase veya hook uzerinden erisim zorunludur.
 */

const MESSAGE =
  'UI katmanindan dogrudan repository importu yasaktir. UseCase veya hook uzerinden erisin.';

// Repository path pattern'leri
const REPO_PATH_PATTERNS = [
  /\/repository\//i,
  /\/repositories\//i,
  /Repo\.ts$/,
  /Repository\.ts$/,
];

// Named export pattern'leri
const REPO_EXPORT_PATTERN = /(?:Repo|Repository)$/;

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'UI katmanindan dogrudan repository importunu yasaklar, katmanli mimari zorunlu kilar.',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noDirectRepoImport: MESSAGE,
    },
  },

  create(context) {
    const filename = context.filename;

    // Sadece TSX dosyalarinda kontrol et
    if (!filename.endsWith('.tsx')) return {};

    // UseCase dosyalari istisna — repo'ya erisebilir
    if (filename.includes('/usecases/') || filename.includes('/usecase/')) return {};

    // Test dosyalari istisna
    if (
      filename.includes('.test.') ||
      filename.includes('.spec.') ||
      filename.includes('__tests__/')
    ) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Path segment kontrolu
        const hasRepoPath = REPO_PATH_PATTERNS.some((pattern) =>
          pattern.test(source),
        );

        if (hasRepoPath) {
          context.report({
            node,
            messageId: 'noDirectRepoImport',
          });
          return;
        }

        // Named export kontrolu (import { UserRepo } from '...')
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportSpecifier') {
            const name = specifier.imported?.name || '';
            if (REPO_EXPORT_PATTERN.test(name)) {
              context.report({
                node,
                messageId: 'noDirectRepoImport',
              });
              return;
            }
          }
        }
      },
    };
  },
};

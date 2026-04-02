// @project/config-eslint — Shared ESLint flat config
// Faz E'de eslint + typescript-eslint + eslint-plugin-react kurulunca genisletilecek.
// Su an minimum calisabilir yapiyi sunuyor.

/**
 * @param {Object} options
 * @param {'web' | 'mobile' | 'library'} options.type - Proje tipi
 * @returns {import('eslint').Linter.Config[]}
 */
export function createConfig({ type = 'library' } = {}) {
  /** @type {import('eslint').Linter.Config[]} */
  const configs = [
    {
      // Global ignores
      ignores: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'coverage/**',
        '.turbo/**',
        '.expo/**',
      ],
    },
    {
      // Temel kurallar — typescript-eslint Faz E'de eklenecek
      files: ['**/*.{ts,tsx,js,jsx}'],
      rules: {
        'no-console': 'warn',
        'no-debugger': 'error',
      },
    },
  ];

  return configs;
}

export default createConfig();

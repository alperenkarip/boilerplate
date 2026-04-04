// @project/config-eslint — Shared ESLint flat config
// Boilerplate kodlama standartlarini enforce eder.

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
      // Temel kurallar
      files: ['**/*.{ts,tsx,js,jsx}'],
      rules: {
        // Konsol ve debug
        'no-console': 'warn',
        'no-debugger': 'error',

        // Dosya boyut limitleri
        'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],

        // Guvenlik
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',

        // Genel kalite
        'no-var': 'error',
        'prefer-const': 'warn',
        'eqeqeq': ['error', 'always'],
      },
    },
  ];

  // Web-spesifik kurallar
  if (type === 'web') {
    configs.push({
      files: ['**/*.{ts,tsx}'],
      rules: {
        // Web-spesifik kurallar buraya eklenecek
      },
    });
  }

  // Mobile-spesifik kurallar
  if (type === 'mobile') {
    configs.push({
      files: ['**/*.{ts,tsx}'],
      rules: {
        // Mobile-spesifik kurallar (raw component yasaklari vs.)
        // eslint-plugin-bp kuruldugunda:
        // '@project/bp/no-raw-pressable': 'error',
        // '@project/bp/no-raw-touchable': 'error',
        // '@project/bp/no-raw-rn-text': 'error',
      },
    });
  }

  // Test dosyalari icin override
  configs.push({
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
    ],
    rules: {
      'max-lines': 'off',
      'no-console': 'off',
    },
  });

  // Theme/token dosyalari icin override
  configs.push({
    files: ['**/theme/**/*.{ts,tsx}', '**/design-tokens/**/*.{ts,tsx}'],
    rules: {
      'max-lines': 'off',
      // eslint-plugin-bp kuruldugunda:
      // '@project/bp/no-hardcoded-color': 'off',
      // '@project/bp/no-hardcoded-spacing': 'off',
      // '@project/bp/no-hardcoded-font-size': 'off',
      // '@project/bp/no-hardcoded-font-weight': 'off',
      // '@project/bp/no-hardcoded-dimension': 'off',
    },
  });

  return configs;
}

export default createConfig();

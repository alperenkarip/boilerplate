// Root ESLint flat config — TypeScript + React + Boilerplate Standards
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import bpPlugin from '@project/eslint-plugin-bp';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.turbo/**',
      '.expo/**',
      'pnpm-lock.yaml',
      '**/*.stories.tsx',
    ],
  },
  // Ana kurallar
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Konsol ve debug
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // TypeScript strict
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Dosya boyut limitleri
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],

      // Karmasiklik limitleri
      'complexity': ['warn', 15],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],

      // Import siralamasi (not: eslint-plugin-import gerektirir, yoksa kaldir)
      // 'import/order': ['warn', { ... }],
      // 'import/newline-after-import': 'warn',

      // Guvenlik
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // Genel kalite
      'no-var': 'error',
      'prefer-const': 'warn',
      'eqeqeq': ['error', 'always'],
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'warn',
      'no-return-await': 'warn',

      // Import kisitlamalari
      'no-restricted-imports': ['warn', {
        patterns: [
          {
            group: ['*/index', '*/index.ts', '*/index.tsx'],
            message: 'Barrel import yasaktir. Dogrudan dosya yolunu kullanin.',
          },
        ],
        paths: [
          {
            name: 'react-native',
            importNames: ['Pressable'],
            message: 'Dogrudan Pressable kullanimi yasaktir. Button wrapper kullanin.',
          },
          {
            name: 'react-native',
            importNames: ['TouchableOpacity', 'TouchableHighlight', 'TouchableNativeFeedback', 'TouchableWithoutFeedback'],
            message: 'Dogrudan Touchable kullanimi yasaktir. Button wrapper kullanin.',
          },
          {
            name: 'react-native',
            importNames: ['Text'],
            message: 'Dogrudan react-native Text kullanimi yasaktir. Text wrapper kullanin.',
          },
          {
            name: 'react-native',
            importNames: ['Modal'],
            message: 'Dogrudan react-native Modal kullanimi yasaktir. AppModal wrapper kullanin.',
          },
          {
            name: 'react-native',
            importNames: ['Animated'],
            message: 'react-native Animated API yerine Reanimated v2+ kullanin (ADR-018).',
          },
          {
            name: 'react-native',
            importNames: ['SafeAreaView'],
            message: 'react-native SafeAreaView yerine react-native-safe-area-context kullanin.',
          },
        ],
      }],

      // Guvenlik — eslint-plugin-security kuruldugunda aktiflestirilecek:
      // 'security/detect-unsafe-regex': 'error',
      // 'security/detect-eval-with-expression': 'error',
      // 'security/detect-buffer-noassert': 'error',
      // 'security/detect-non-literal-regexp': 'warn',
      // 'security/detect-possible-timing-attacks': 'warn',

      // i18n — eslint-plugin-i18next kuruldugunda aktiflestirilecek:
      // 'i18next/no-literal-string': ['warn', { mode: 'jsx-text-only' }],

      // Accessibility — eslint-plugin-react-native-a11y kuruldugunda aktiflestirilecek:
      // 'react-native-a11y/has-accessibility-props': 'warn',
      // 'react-native-a11y/has-valid-accessibility-role': 'warn',
      // 'react-native-a11y/has-valid-accessibility-descriptors': 'warn',
    },
  },
  // @project/eslint-plugin-bp — Custom boilerplate kurallari (warn ile baslat, kademeli error'a yukselt)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@project/bp': bpPlugin,
    },
    rules: {
      '@project/bp/no-hardcoded-color': 'warn',
      '@project/bp/no-hardcoded-spacing': 'warn',
      '@project/bp/no-hardcoded-font-size': 'warn',
      '@project/bp/no-hardcoded-font-weight': 'warn',
      '@project/bp/no-hardcoded-dimension': 'warn',
      '@project/bp/no-direct-repo-import': 'warn',
      '@project/bp/no-raw-pressable': 'warn',
      '@project/bp/no-raw-touchable': 'warn',
      '@project/bp/no-raw-rn-text': 'warn',
      '@project/bp/require-form-hook': 'warn',
      '@project/bp/require-design-token': 'warn',
      '@project/bp/no-barrel-import': 'warn',
      '@project/bp/no-token-category-mismatch': 'warn',
      '@project/bp/require-accessibility-props': 'warn',
      '@project/bp/no-raw-modal': 'warn',
      '@project/bp/no-direct-phosphor-import': 'warn',
      '@project/bp/no-direct-vector-icons-import': 'warn',
      '@project/bp/no-inline-text-style': 'warn',
      '@project/bp/no-animated-api': 'warn',
    },
  },
  // Design token ve theme dosyalarinda hardcoded deger kontrolleri devre disi
  {
    files: ['**/theme/**/*.{ts,tsx}', '**/design-tokens/**/*.{ts,tsx}'],
    rules: {
      '@project/bp/no-hardcoded-color': 'off',
      '@project/bp/no-hardcoded-spacing': 'off',
      '@project/bp/no-hardcoded-font-size': 'off',
      '@project/bp/no-hardcoded-font-weight': 'off',
      '@project/bp/no-hardcoded-dimension': 'off',
      '@project/bp/require-design-token': 'off',
    },
  },
  // Test dosyalari icin override
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines': 'off',
      'no-console': 'off',
      'no-restricted-imports': 'off',
      '@project/bp/require-form-hook': 'off',
      '@project/bp/require-accessibility-props': 'off',
      '@project/bp/no-hardcoded-color': 'off',
      '@project/bp/no-hardcoded-spacing': 'off',
    },
  },
  // Config dosyalari icin override
  {
    files: ['*.config.{js,ts,mjs}', '**/*.config.{js,ts,mjs}'],
    rules: {
      'max-lines': 'off',
    },
  },
);

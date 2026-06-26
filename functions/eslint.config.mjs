// Standalone lint chain for the Cloud Functions workspace (ESLint 9 flat config).
//
// This is server-side Node code, so it deliberately does NOT consume the repo's
// eslint-plugin-bp (those rules target web/React Native and do not apply here).
// A small @typescript-eslint base is sufficient.
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['lib/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // any is forbidden in this workspace (ADR-020 strictness contract).
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);

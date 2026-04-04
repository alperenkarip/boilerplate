/**
 * Recommended config — tum kurallarin varsayilan seviyeleri.
 * ESLint 9 Flat Config uyumlu.
 */

export default {
  plugins: ['@project/bp'],
  rules: {
    '@project/bp/no-hardcoded-color': 'error',
    '@project/bp/no-hardcoded-spacing': 'warn',
    '@project/bp/no-hardcoded-font-size': 'error',
    '@project/bp/no-hardcoded-font-weight': 'error',
    '@project/bp/no-hardcoded-dimension': 'warn',
    '@project/bp/no-direct-repo-import': 'warn',
    '@project/bp/no-raw-pressable': 'error',
    '@project/bp/no-raw-touchable': 'error',
    '@project/bp/no-raw-rn-text': 'error',
    '@project/bp/require-form-hook': 'error',
    '@project/bp/require-design-token': 'error',
    '@project/bp/no-barrel-import': 'warn',
    '@project/bp/no-token-category-mismatch': 'error',
    '@project/bp/require-accessibility-props': 'warn',
    '@project/bp/no-raw-modal': 'error',
    '@project/bp/no-direct-phosphor-import': 'error',
    '@project/bp/no-direct-vector-icons-import': 'error',
    '@project/bp/no-inline-text-style': 'warn',
    '@project/bp/no-animated-api': 'warn',
  },
};

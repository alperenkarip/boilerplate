/**
 * @project/eslint-plugin-bp
 * Boilerplate custom ESLint plugin — design token, architecture, component wrapper kurallari.
 * ESLint 9 Flat Config uyumlu (ESM).
 */

// --- Kurallar ---
import noHardcodedColor from './rules/no-hardcoded-color.js';
import noHardcodedSpacing from './rules/no-hardcoded-spacing.js';
import noHardcodedFontSize from './rules/no-hardcoded-font-size.js';
import noHardcodedFontWeight from './rules/no-hardcoded-font-weight.js';
import noHardcodedDimension from './rules/no-hardcoded-dimension.js';
import noDirectRepoImport from './rules/no-direct-repo-import.js';
import noRawPressable from './rules/no-raw-pressable.js';
import noRawTouchable from './rules/no-raw-touchable.js';
import noRawRnText from './rules/no-raw-rn-text.js';
import requireFormHook from './rules/require-form-hook.js';
import requireDesignToken from './rules/require-design-token.js';
import noBarrelImport from './rules/no-barrel-import.js';
import noTokenCategoryMismatch from './rules/no-token-category-mismatch.js';
import requireAccessibilityProps from './rules/require-accessibility-props.js';
import noRawModal from './rules/no-raw-modal.js';
import noDirectPhosphorImport from './rules/no-direct-phosphor-import.js';
import noDirectVectorIconsImport from './rules/no-direct-vector-icons-import.js';
import noInlineTextStyle from './rules/no-inline-text-style.js';
import noAnimatedApi from './rules/no-animated-api.js';

// --- Config'ler ---
import recommended from './configs/recommended.js';

// Kural eslestirme tablosu
const rules = {
  'no-hardcoded-color': noHardcodedColor,
  'no-hardcoded-spacing': noHardcodedSpacing,
  'no-hardcoded-font-size': noHardcodedFontSize,
  'no-hardcoded-font-weight': noHardcodedFontWeight,
  'no-hardcoded-dimension': noHardcodedDimension,
  'no-direct-repo-import': noDirectRepoImport,
  'no-raw-pressable': noRawPressable,
  'no-raw-touchable': noRawTouchable,
  'no-raw-rn-text': noRawRnText,
  'require-form-hook': requireFormHook,
  'require-design-token': requireDesignToken,
  'no-barrel-import': noBarrelImport,
  'no-token-category-mismatch': noTokenCategoryMismatch,
  'require-accessibility-props': requireAccessibilityProps,
  'no-raw-modal': noRawModal,
  'no-direct-phosphor-import': noDirectPhosphorImport,
  'no-direct-vector-icons-import': noDirectVectorIconsImport,
  'no-inline-text-style': noInlineTextStyle,
  'no-animated-api': noAnimatedApi,
};

// Config eslestirme tablosu
const configs = {
  recommended,
};

// Plugin nesnesi
const plugin = {
  meta: {
    name: '@project/eslint-plugin-bp',
    version: '0.1.0',
  },
  rules,
  configs,
};

export default plugin;
export { rules, configs };

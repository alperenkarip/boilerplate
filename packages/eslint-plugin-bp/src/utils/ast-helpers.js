/**
 * AST yardimci fonksiyonlari — ESLint kural dosyalarinda ortak kullanim.
 */

// @MX:ANCHOR: [AUTO] Shared react-native import detector used by all RN-wrapper lint rules
// @MX:REASON: fan_in=5 distinct rule files depend on this predicate; a false negative here disables enforcement across multiple rules
/**
 * Import node'unun react-native'den gelip gelmedigini kontrol eder.
 * @param {import('estree').ImportDeclaration} node
 * @returns {boolean}
 */
export function isFromReactNative(node) {
  return (
    node.type === 'ImportDeclaration' &&
    node.source.value === 'react-native'
  );
}

/**
 * Import declaration'daki specifier isimlerini doner.
 * @param {import('estree').ImportDeclaration} node
 * @returns {string[]}
 */
export function getImportSpecifiers(node) {
  if (node.type !== 'ImportDeclaration') return [];
  return node.specifiers
    .filter((s) => s.type === 'ImportSpecifier')
    .map((s) => s.imported.name);
}

/**
 * Node'un StyleSheet.create() cagrisinin icinde olup olmadigini kontrol eder.
 * @param {import('estree').Node} node
 * @returns {boolean}
 */
export function isInsideStyleSheet(node) {
  let current = node.parent;
  while (current) {
    if (
      current.type === 'CallExpression' &&
      current.callee?.type === 'MemberExpression' &&
      current.callee.object?.name === 'StyleSheet' &&
      current.callee.property?.name === 'create'
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

// @MX:ANCHOR: [AUTO] Shared Reanimated-scope detector used to exempt animated values from hardcoded-value rules
// @MX:REASON: fan_in=5 distinct rule files; misclassifying animated scope causes false positives across hardcoded-spacing/color/font rules
/**
 * Node'un Reanimated useAnimatedStyle / withTiming vb. icerisinde
 * olup olmadigini kontrol eder.
 * @param {import('estree').Node} node
 * @returns {boolean}
 */
export function isInsideAnimatedStyle(node) {
  const animatedHooks = new Set([
    'useAnimatedStyle',
    'useDerivedValue',
    'useAnimatedProps',
    'withTiming',
    'withSpring',
    'withDecay',
    'withSequence',
    'withRepeat',
    'interpolate',
  ]);

  let current = node.parent;
  while (current) {
    if (
      current.type === 'CallExpression' &&
      current.callee?.type === 'Identifier' &&
      animatedHooks.has(current.callee.name)
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/**
 * JSX attribute'un degerini cikartir (string veya expression).
 * @param {import('estree-jsx').JSXAttribute} attr
 * @returns {*}
 */
export function getJSXAttributeValue(attr) {
  if (!attr || !attr.value) return undefined;

  // JSXExpressionContainer: {value}
  if (attr.value.type === 'JSXExpressionContainer') {
    return attr.value.expression;
  }

  // Literal: "value"
  if (attr.value.type === 'Literal') {
    return attr.value;
  }

  return attr.value;
}

// @MX:ANCHOR: [AUTO] Shared exception-file gate consulted by nearly every lint rule before reporting
// @MX:REASON: fan_in=8 distinct rule files — highest in this package; a regression here would suppress or over-trigger violations plugin-wide
/**
 * Dosyanin istisna listesindeki bir pattern'e uyup uymadigini kontrol eder.
 * @param {string} filename - Dosya yolu
 * @param {string[]} exceptions - Istisna pattern'leri
 * @returns {boolean}
 */
export function isExceptionFile(filename, exceptions) {
  if (!filename || !exceptions) return false;
  return exceptions.some((pattern) => filename.includes(pattern));
}

/**
 * JSX opening element'te belirli bir prop olup olmadigini kontrol eder.
 * @param {import('estree-jsx').JSXOpeningElement} openingElement
 * @param {string} propName
 * @returns {boolean}
 */
export function hasJSXProp(openingElement, propName) {
  if (!openingElement || !openingElement.attributes) return false;
  return openingElement.attributes.some(
    (attr) => attr.type === 'JSXAttribute' && attr.name?.name === propName,
  );
}

/**
 * JSX element ismini string olarak doner.
 * @param {import('estree-jsx').JSXOpeningElement} openingElement
 * @returns {string}
 */
export function getJSXElementName(openingElement) {
  if (!openingElement || !openingElement.name) return '';

  // <Component />
  if (openingElement.name.type === 'JSXIdentifier') {
    return openingElement.name.name;
  }

  // <Namespace.Component />
  if (openingElement.name.type === 'JSXMemberExpression') {
    const parts = [];
    let current = openingElement.name;
    while (current.type === 'JSXMemberExpression') {
      parts.unshift(current.property.name);
      current = current.object;
    }
    parts.unshift(current.name);
    return parts.join('.');
  }

  return '';
}

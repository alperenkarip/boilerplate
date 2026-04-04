/**
 * Token whitelist tanimlari — bp- prefix'li semantic token'lar.
 * Derived project'ler kendi prefix'lerini tanimlayabilir.
 */

// --- Spacing token'lari (t-shirt scale) ---
export const SPACING_TOKENS = {
  'bp-xxxs': 2,
  'bp-xxs': 4,
  'bp-xs': 8,
  'bp-sm': 12,
  'bp-md': 16,
  'bp-lg': 24,
  'bp-xl': 32,
  'bp-xxl': 48,
  'bp-xxxl': 64,
};

// Tailwind numeric -> bp- t-shirt scale eslestirme
export const TAILWIND_NUMERIC_TO_BP = {
  0.5: 'bp-xxxs',
  1: 'bp-xxs',
  2: 'bp-xs',
  3: 'bp-sm',
  4: 'bp-md',
  6: 'bp-lg',
  8: 'bp-xl',
  12: 'bp-xxl',
  16: 'bp-xxxl',
};

// Istisna spacing degerleri — bu degerler hardcoded kullanilabilir
export const EXEMPT_SPACING_VALUES = new Set([
  0, 1.5, 2.5, 3.5, 5, 7, 9, 10, 11, 14, 20, 24, 32,
]);

// --- Renk token'lari ---

// Sadece text- prefix'i ile kullanilabilir
export const TEXT_ONLY_TOKENS = new Set([
  'bp-content',
  'bp-content-secondary',
  'bp-content-tertiary',
  'bp-content-disabled',
  'bp-content-inverse',
  'bp-on-primary',
]);

// Sadece bg- prefix'i ile kullanilabilir
export const BG_ONLY_TOKENS = new Set([
  'bp-canvas',
  'bp-surface',
  'bp-elevated',
  'bp-muted',
  'bp-background',
  'bp-overlay-20',
  'bp-overlay-50',
]);

// Sadece border- prefix'i ile kullanilabilir
export const BORDER_ONLY_TOKENS = new Set([
  'bp-stroke',
  'bp-stroke-strong',
  'bp-stroke-subtle',
  'bp-separator',
  'bp-divider',
]);

// Esnek — herhangi bir prefix ile kullanilabilir (brand/state)
export const FLEXIBLE_TOKENS = new Set([
  'bp-primary',
  'bp-accent',
  'bp-success',
  'bp-warning',
  'bp-error',
  'bp-info',
]);

// Text pozisyon class'lari — renk kurali disinda
export const TEXT_POSITION_CLASSES = new Set([
  'text-left',
  'text-center',
  'text-right',
  'text-justify',
]);

// Istisna renk isimleri — her yerde kullanilabilir
export const EXEMPT_COLOR_NAMES = new Set([
  'transparent',
  'white',
  'black',
  'inherit',
  'current',
  'currentColor',
]);

// Tum bp- token'lari (kategori kontrolu icin)
export const ALL_BP_TOKENS = new Set([
  ...TEXT_ONLY_TOKENS,
  ...BG_ONLY_TOKENS,
  ...BORDER_ONLY_TOKENS,
  ...FLEXIBLE_TOKENS,
]);

// CSS named colors — hardcoded renk tespiti icin
export const CSS_NAMED_COLORS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
  'beige', 'bisque', 'blanchedalmond', 'blue', 'blueviolet',
  'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate',
  'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
  'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen',
  'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange',
  'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
  'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet',
  'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
  'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
  'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow',
  'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory',
  'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon',
  'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
  'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon',
  'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
  'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen',
  'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid',
  'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
  'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
  'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
  'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
  'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip',
  'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
  'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown',
  'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver',
  'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
  'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato',
  'turquoise', 'violet', 'wheat', 'whitesmoke', 'yellow', 'yellowgreen',
]);

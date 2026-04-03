// Light tema — semantic token degerleri
// @MX:ANCHOR: [AUTO] Light theme token set — consumed by ThemeProvider and all themed components
// @MX:REASON: Token value changes cascade to entire light mode UI; must match SemanticTokenSet contract
import { gray, blue, green, red, amber, white } from '../raw/colors';
import type { SemanticTokenSet } from '../semantic/types';

export const lightTheme: SemanticTokenSet = {
  content: {
    primary: gray[900],
    secondary: gray[600],
    tertiary: gray[400],
    disabled: gray[300],
    inverse: white,
    success: green[700],
    warning: amber[700],
    error: red[700],
    info: blue[700],
  },
  surface: {
    default: white,
    subtle: gray[50],
    elevated: white,
    sunken: gray[100],
    inverse: gray[900],
    successSoft: green[50],
    warningSoft: amber[50],
    errorSoft: red[50],
    infoSoft: blue[50],
  },
  border: {
    default: gray[200],
    subtle: gray[100],
    strong: gray[400],
    focus: blue[500],
    success: green[500],
    warning: amber[500],
    error: red[500],
  },
  interactive: {
    primaryBg: blue[600],
    primaryFg: white,
    primaryHover: blue[700],
    primaryPressed: blue[800],
    secondaryBg: gray[100],
    secondaryFg: gray[900],
    secondaryHover: gray[200],
    secondaryPressed: gray[300],
    disabledBg: gray[100],
    disabledFg: gray[400],
  },
  feedback: {
    success: green[600],
    warning: amber[500],
    error: red[600],
    info: blue[600],
  },
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.5)',
    focusRing: `${blue[500]}80`,
  },
} as const;

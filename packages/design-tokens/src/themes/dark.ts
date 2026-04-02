// Dark tema — semantic token degerleri
import { gray, blue, green, red, amber, white } from '../raw/colors';
import type { SemanticTokenSet } from '../semantic/types';

export const darkTheme: SemanticTokenSet = {
  content: {
    primary: gray[50],
    secondary: gray[400],
    tertiary: gray[500],
    disabled: gray[600],
    inverse: gray[900],
    success: green[400],
    warning: amber[400],
    error: red[400],
    info: blue[400],
  },
  surface: {
    default: gray[900],
    subtle: gray[800],
    elevated: gray[800],
    sunken: gray[950],
    inverse: white,
    successSoft: '#052e1640',
    warningSoft: '#451a0340',
    errorSoft: '#450a0a40',
    infoSoft: '#17255440',
  },
  border: {
    default: gray[700],
    subtle: gray[800],
    strong: gray[500],
    focus: blue[400],
    success: green[400],
    warning: amber[400],
    error: red[400],
  },
  interactive: {
    primaryBg: blue[500],
    primaryFg: white,
    primaryHover: blue[400],
    primaryPressed: blue[300],
    secondaryBg: gray[800],
    secondaryFg: gray[50],
    secondaryHover: gray[700],
    secondaryPressed: gray[600],
    disabledBg: gray[800],
    disabledFg: gray[600],
  },
  feedback: {
    success: green[400],
    warning: amber[400],
    error: red[400],
    info: blue[400],
  },
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.7)',
    focusRing: `${blue[400]}80`,
  },
} as const;

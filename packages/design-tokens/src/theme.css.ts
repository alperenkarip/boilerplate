// CSS dosyasi uretim scripti — build time'da calistirilabilir
// Veya dogrudan generateCSSVariables import edilerek kullanilabilir

import { generateCSSVariables } from './css';
import { lightTheme } from './themes/light';
import { darkTheme } from './themes/dark';

export const lightCSS = `:root {\n${generateCSSVariables(lightTheme)}\n}`;

export const darkCSS = `[data-theme="dark"] {\n${generateCSSVariables(darkTheme)}\n}`;

export const fullCSS = `${lightCSS}\n\n${darkCSS}`;

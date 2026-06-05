// Semantic token tip tanimlari — tema mapping'i bu tiplere uyar

export interface ContentTokens {
  readonly primary: string;
  readonly secondary: string;
  readonly tertiary: string;
  readonly disabled: string;
  readonly inverse: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
}

export interface SurfaceTokens {
  readonly default: string;
  readonly subtle: string;
  readonly elevated: string;
  readonly sunken: string;
  readonly inverse: string;
  readonly successSoft: string;
  readonly warningSoft: string;
  readonly errorSoft: string;
  readonly infoSoft: string;
}

export interface BorderTokens {
  readonly default: string;
  readonly subtle: string;
  readonly strong: string;
  readonly focus: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
}

export interface InteractiveTokens {
  readonly primaryBg: string;
  readonly primaryFg: string;
  readonly primaryHover: string;
  readonly primaryPressed: string;
  readonly secondaryBg: string;
  readonly secondaryFg: string;
  readonly secondaryHover: string;
  readonly secondaryPressed: string;
  readonly disabledBg: string;
  readonly disabledFg: string;
}

export interface FeedbackTokens {
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
}

export interface OverlayTokens {
  readonly backdrop: string;
  readonly focusRing: string;
}

// @MX:ANCHOR: [AUTO] Central semantic token shape — all themes and consumers conform to this contract
// @MX:REASON: fan_in=5 (ThemeProvider, nativewindStrategy, light theme, dark theme, css generator); adding/removing a token category breaks every theme and themed consumer
export interface SemanticTokenSet {
  readonly content: ContentTokens;
  readonly surface: SurfaceTokens;
  readonly border: BorderTokens;
  readonly interactive: InteractiveTokens;
  readonly feedback: FeedbackTokens;
  readonly overlay: OverlayTokens;
}

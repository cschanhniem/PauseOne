import { Platform } from "react-native"

import { typography as tokenTypography } from "./tokens"

// We are not loading custom fonts via this mechanism anymore.
// "Plus Jakarta Sans" should be loaded via web-specific means (e.g., index.html)
// and included in the native assets.
export const customFontsToLoad = {}

const fonts = {
  jakarta: {
    // The primary font for the app, as defined in the design system.
    // The font string is pulled from our design tokens.
    normal: tokenTypography.fontSans,
    // Define weights based on the design system.
    // Note: React Native uses `fontWeight` which can be a string like '400' or '600'.
    regular: "400",
    bold: "600",
  },
  // Keep fallback fonts for platform-specific cases if needed.
  helveticaNeue: {
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  sansSerif: {
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.jakarta,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: { fontFamily: "Courier" }, android: { fontFamily: "monospace" } }),
}

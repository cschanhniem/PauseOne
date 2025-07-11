import { color } from "./tokens"

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette: {
    white: color.white,
    bgDark: color.bgDark,
    glass: color.glass,
    textHigh: color.textHigh,
    textLow: color.textLow,
  },
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: color.textHigh,
  /**
   * Secondary text information.
   */
  textDim: color.textLow,
  /**
   * The default color of the screen background.
   */
  background: color.bgDark,
  /**
   * The default border color.
   */
  border: color.glass,
  /**
   * The main tinting color.
   */
  tint: color.gradientPrimary,
  /**
   * A subtle color used for lines.
   */
  separator: color.glass,
  /**
   * Error messages.
   */
  error: "#C03403", // Kept from original for now
  /**
   * Error Background.
   */
  errorBackground: "#F2D6CD", // Kept from original for now
} as const

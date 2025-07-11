import { spacing as tokenSpacing } from "./tokens"

/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
export const spacing = {
  "1": parseInt(tokenSpacing["1"], 10), // 4
  "2": parseInt(tokenSpacing["2"], 10), // 8
  "3": parseInt(tokenSpacing["3"], 10), // 16
  "4": parseInt(tokenSpacing["4"], 10), // 24
} as const

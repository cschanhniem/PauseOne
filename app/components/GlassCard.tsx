import { ComponentProps } from "react"
import { View, ViewStyle } from "react-native"

import { colors } from "../theme/colors"
import { radius } from "../theme/tokens"

// Note: `backdrop-filter` is not supported in React Native.
// This component will simulate the glass effect using semi-transparent backgrounds.
// For a true frosted glass effect, a library like @react-native-community/blur
// would be needed. For now, we will stick to the spec as closely as possible
// with standard components.

interface GlassCardProps extends ComponentProps<typeof View> {
  style?: ViewStyle
}

export function GlassCard(props: GlassCardProps) {
  const { style: styleOverride, ...rest } = props

  return <View style={[$container, styleOverride]} {...rest} />
}

const $container: ViewStyle = {
  backgroundColor: colors.palette.glass,
  borderRadius: parseInt(radius.lg, 10),
  // The spec calls for `backdrop-filter: blur(...)` which is not standard in RN.
  // The `elevation` and a subtle border can help create a sense of depth.
  elevation: 8, // This is an Android-only property for shadow.
  shadowColor: "#000", // iOS shadow properties
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 20,
  // The spec mentions an inner shadow, which is also tricky in React Native.
  // A simple border can provide a similar visual cue.
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.15)",
}

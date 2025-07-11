import { ReactNode } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { Text, TextProps } from "./Text"
import { colors } from "../theme/colors"
import { spacing } from "../theme/spacing"
import { radius, typography as tokenTypography } from "../theme/tokens"
import { typography } from "../theme/typography"

export interface ButtonProps extends PressableProps {
  tx?: TextProps["tx"]
  text?: TextProps["text"]
  style?: StyleProp<ViewStyle>
  pressedStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: ReactNode
}

export function Button(props: ButtonProps) {
  const { tx, text, style: $viewStyleOverride, pressedStyle, textStyle, children, ...rest } = props

  const $textStyle = (state: PressableStateCallbackType): StyleProp<TextStyle> =>
    StyleSheet.flatten([$baseTextStyle, textStyle, state.pressed && { opacity: 0.9 }])

  return (
    <Pressable
      style={(state) =>
        StyleSheet.flatten([
          $baseViewStyle,
          $viewStyleOverride,
          state.pressed && [$pressedViewStyle, pressedStyle],
        ])
      }
      {...rest}
    >
      {(state) => (
        <>
          {state.pressed && (
            <LinearGradient
              colors={["#4C90FF", "#65F9D5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: parseInt(radius.lg, 10) }]}
            />
          )}
          <Text tx={tx} text={text} style={$textStyle(state)}>
            {children}
          </Text>
        </>
      )}
    </Pressable>
  )
}

const $baseViewStyle: ViewStyle = {
  minHeight: 64,
  borderRadius: parseInt(radius.lg, 10),
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[4],
  width: "100%",
  backgroundColor: colors.palette.glass,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: colors.border,
  marginVertical: spacing[2],
}

const $pressedViewStyle: ViewStyle = {
  transform: [{ scale: 0.96 }],
}

const $baseTextStyle: TextStyle = {
  fontSize: parseInt(tokenTypography.fsBody, 10),
  lineHeight: tokenTypography.lineHeightBody * parseInt(tokenTypography.fsBody, 10),
  fontFamily: typography.primary.normal,
  fontWeight: tokenTypography.fwBold.toString() as "600",
  color: colors.text,
  textAlign: "center",
}

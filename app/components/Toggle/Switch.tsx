import { useEffect, useMemo, useRef, useCallback } from "react"
import {
  Animated,
  Image,
  ImageStyle,
  Platform,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native"

import { $inputOuterBase, BaseToggleInputProps, Toggle, ToggleProps } from "./Toggle"
import { iconRegistry } from "../../components/Icon"
import { isRTL } from "../../i18n"
import { colors } from "../../theme/colors"

export interface SwitchToggleProps extends Omit<ToggleProps<SwitchInputProps>, "ToggleInput"> {
  accessibilityMode?: "text" | "icon"
  inputDetailStyle?: Omit<ViewStyle, "width" | "height"> & { width?: number; height?: number }
}

interface SwitchInputProps extends BaseToggleInputProps<SwitchToggleProps> {
  accessibilityMode?: SwitchToggleProps["accessibilityMode"]
}

export function Switch(props: SwitchToggleProps) {
  const { accessibilityMode, ...rest } = props
  const switchInput = useCallback(
    (toggleProps: SwitchInputProps) => (
      <SwitchInput {...toggleProps} accessibilityMode={accessibilityMode} />
    ),
    [accessibilityMode],
  )
  return <Toggle accessibilityRole="switch" {...rest} ToggleInput={switchInput} />
}

function SwitchInput(props: SwitchInputProps) {
  const {
    on,
    status,
    disabled,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props

  const animate = useRef(new Animated.Value(on ? 1 : 0))
  const opacity = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(animate.current, {
      toValue: on ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [on])

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: on ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [on])

  const knobSizeFallback = 2

  const knobWidth = [$detailStyleOverride?.width, $switchDetail?.width, knobSizeFallback].find(
    (v) => typeof v === "number",
  )

  const knobHeight = [$detailStyleOverride?.height, $switchDetail?.height, knobSizeFallback].find(
    (v) => typeof v === "number",
  )

  const offBackgroundColor = [
    disabled && colors.textDim,
    status === "error" && colors.errorBackground,
    colors.palette.glass,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.transparent,
    status === "error" && colors.errorBackground,
    colors.tint,
  ].filter(Boolean)[0]

  const knobBackgroundColor = (function () {
    if (on) {
      return [
        $detailStyleOverride?.backgroundColor,
        status === "error" && colors.error,
        disabled && colors.textDim,
        colors.palette.white,
      ].filter(Boolean)[0]
    } else {
      return [
        $innerStyleOverride?.backgroundColor,
        disabled && colors.textDim,
        status === "error" && colors.error,
        colors.palette.glass,
      ].filter(Boolean)[0]
    }
  })()

  const rtlAdjustment = isRTL ? -1 : 1
  const $themedSwitchInner = useMemo(() => [$switchInner], [])

  const offsetLeft = ($innerStyleOverride?.paddingStart ||
    $innerStyleOverride?.paddingLeft ||
    $themedSwitchInner[0]?.paddingStart ||
    $themedSwitchInner[0]?.paddingLeft ||
    0) as number

  const offsetRight = ($innerStyleOverride?.paddingEnd ||
    $innerStyleOverride?.paddingRight ||
    $themedSwitchInner[0]?.paddingEnd ||
    $themedSwitchInner[0]?.paddingRight ||
    0) as number

  const outputRange =
    Platform.OS === "web"
      ? isRTL
        ? [+(knobWidth || 0) + offsetRight, offsetLeft]
        : [offsetLeft, +(knobWidth || 0) + offsetRight]
      : [rtlAdjustment * offsetLeft, rtlAdjustment * (+(knobWidth || 0) + offsetRight)]

  const $animatedSwitchKnob = animate.current.interpolate({
    inputRange: [0, 1],
    outputRange,
  })

  return (
    <View style={[$inputOuter, { backgroundColor: offBackgroundColor }, $outerStyleOverride]}>
      <Animated.View
        style={[
          $themedSwitchInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          { opacity: opacity.current },
        ]}
      />

      <SwitchAccessibilityLabel {...props} role="on" />
      <SwitchAccessibilityLabel {...props} role="off" />

      <Animated.View
        style={[
          $switchDetail,
          $detailStyleOverride,
          { transform: [{ translateX: $animatedSwitchKnob }] },
          { width: knobWidth, height: knobHeight },
          { backgroundColor: knobBackgroundColor },
        ]}
      />
    </View>
  )
}

function SwitchAccessibilityLabel(props: SwitchInputProps & { role: "on" | "off" }) {
  const { on, disabled, status, accessibilityMode, role, innerStyle, detailStyle } = props

  if (!accessibilityMode) return null

  const shouldLabelBeVisible = (on && role === "on") || (!on && role === "off")

  const $switchAccessibilityStyle: StyleProp<ViewStyle> = [
    $switchAccessibility,
    role === "off" && { end: "5%" },
    role === "on" && { left: "5%" },
  ]

  const color = (function () {
    if (disabled) return colors.textDim
    if (status === "error") return colors.error
    if (!on) return innerStyle?.backgroundColor || colors.tint
    return detailStyle?.backgroundColor || colors.palette.white
  })()

  return (
    <View style={$switchAccessibilityStyle}>
      {accessibilityMode === "text" && shouldLabelBeVisible && (
        <View
          style={[
            role === "on" && $switchAccessibilityLine,
            role === "on" && { backgroundColor: color },
            role === "off" && $switchAccessibilityCircle,
            role === "off" && { borderColor: color },
          ]}
        />
      )}

      {accessibilityMode === "icon" && shouldLabelBeVisible && (
        <Image
          style={[$switchAccessibilityIcon, { tintColor: color }]}
          source={role === "off" ? iconRegistry.hidden : iconRegistry.view}
        />
      )}
    </View>
  )
}

const $inputOuter: StyleProp<ViewStyle> = [
  $inputOuterBase,
  { height: 32, width: 56, borderRadius: 16, borderWidth: 0 },
]

const $switchInner: ViewStyle = {
  borderColor: colors.transparent,
  paddingStart: 4,
  paddingEnd: 4,
  ...StyleSheet.absoluteFillObject,
}

const $switchDetail: SwitchToggleProps["inputDetailStyle"] = {
  borderRadius: 12,
  position: "absolute",
  width: 24,
  height: 24,
}

const $switchAccessibility: ViewStyle = {
  width: "40%",
  justifyContent: "center",
  alignItems: "center",
}

const $switchAccessibilityIcon: ImageStyle = {
  width: 14,
  height: 14,
  resizeMode: "contain",
}

const $switchAccessibilityLine: ViewStyle = {
  width: 2,
  height: 12,
}

const $switchAccessibilityCircle: ViewStyle = {
  borderWidth: 2,
  width: 12,
  height: 12,
  borderRadius: 6,
}

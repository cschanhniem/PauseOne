import { useEffect, useRef, useCallback } from "react"
import { Image, ImageStyle, Animated, StyleProp, View, ViewStyle, StyleSheet } from "react-native"

import { colors } from "../../theme/colors"
import { iconRegistry, IconTypes } from "../Icon"
import { $inputOuterBase, BaseToggleInputProps, ToggleProps, Toggle } from "./Toggle"

export interface CheckboxToggleProps extends Omit<ToggleProps<CheckboxInputProps>, "ToggleInput"> {
  inputDetailStyle?: ImageStyle
  icon?: IconTypes
}

interface CheckboxInputProps extends BaseToggleInputProps<CheckboxToggleProps> {
  icon?: CheckboxToggleProps["icon"]
}

export function Checkbox(props: CheckboxToggleProps) {
  const { icon, ...rest } = props
  const checkboxInput = useCallback(
    (toggleProps: CheckboxInputProps) => <CheckboxInput {...toggleProps} icon={icon} />,
    [icon],
  )
  return <Toggle accessibilityRole="checkbox" {...rest} ToggleInput={checkboxInput} />
}

function CheckboxInput(props: CheckboxInputProps) {
  const {
    on,
    status,
    disabled,
    icon = "check",
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props

  const opacity = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: on ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [on])

  const offBackgroundColor = [
    disabled && colors.textDim,
    status === "error" && colors.errorBackground,
    colors.palette.glass,
  ].filter(Boolean)[0]

  const outerBorderColor = [
    disabled && colors.textDim,
    status === "error" && colors.error,
    !on && colors.text,
    colors.tint,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.transparent,
    status === "error" && colors.errorBackground,
    colors.tint,
  ].filter(Boolean)[0]

  const iconTintColor = [
    disabled && colors.textDim,
    status === "error" && colors.error,
    colors.palette.white,
  ].filter(Boolean)[0]

  return (
    <View
      style={[
        $inputOuter,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          $inputInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          { opacity: opacity.current },
        ]}
      >
        <Image
          source={icon ? iconRegistry[icon] : iconRegistry.check}
          style={[
            $checkboxDetail,
            !!iconTintColor && { tintColor: iconTintColor },
            $detailStyleOverride as ImageStyle,
          ]}
        />
      </Animated.View>
    </View>
  )
}

const $checkboxDetail: ImageStyle = {
  width: 20,
  height: 20,
  resizeMode: "contain",
}

const $inputOuter: StyleProp<ViewStyle> = [$inputOuterBase, { borderRadius: 4 }]

const $inputInner: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  ...StyleSheet.absoluteFillObject,
}

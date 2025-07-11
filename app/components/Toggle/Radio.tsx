import { useEffect, useRef } from "react"
import { StyleProp, View, ViewStyle, Animated, StyleSheet } from "react-native"

import { $inputOuterBase, BaseToggleInputProps, ToggleProps, Toggle } from "./Toggle"
import { colors } from "../../theme/colors"

export interface RadioToggleProps extends Omit<ToggleProps<RadioInputProps>, "ToggleInput"> {
  inputDetailStyle?: ViewStyle
}

interface RadioInputProps extends BaseToggleInputProps<RadioToggleProps> {}

export function Radio(props: RadioToggleProps) {
  return <Toggle accessibilityRole="radio" {...props} ToggleInput={RadioInput} />
}

function RadioInput(props: RadioInputProps) {
  const {
    on,
    status,
    disabled,
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
    colors.palette.white,
  ].filter(Boolean)[0]

  const dotBackgroundColor = [
    disabled && colors.textDim,
    status === "error" && colors.error,
    colors.tint,
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
        <View
          style={[$radioDetail, { backgroundColor: dotBackgroundColor }, $detailStyleOverride]}
        />
      </Animated.View>
    </View>
  )
}

const $radioDetail: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 6,
}

const $inputOuter: StyleProp<ViewStyle> = [$inputOuterBase, { borderRadius: 12 }]

const $inputInner: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  ...StyleSheet.absoluteFillObject,
}

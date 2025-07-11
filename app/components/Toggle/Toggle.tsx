import { ComponentType, FC, useMemo } from "react"
import {
  GestureResponderEvent,
  ImageStyle,
  StyleProp,
  SwitchProps,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

import { colors } from "../../theme/colors"
import { spacing } from "../../theme/spacing"
import { Text, TextProps } from "../Text"

export interface ToggleProps<T> extends Omit<TouchableOpacityProps, "style"> {
  status?: "error" | "disabled"
  editable?: TextInputProps["editable"]
  value?: boolean
  onValueChange?: SwitchProps["onValueChange"]
  containerStyle?: StyleProp<ViewStyle>
  inputWrapperStyle?: StyleProp<ViewStyle>
  inputOuterStyle?: ViewStyle
  inputInnerStyle?: ViewStyle
  inputDetailStyle?: ViewStyle
  labelPosition?: "left" | "right"
  label?: TextProps["text"]
  labelTx?: TextProps["tx"]
  labelTxOptions?: TextProps["txOptions"]
  labelStyle?: StyleProp<TextStyle>
  LabelTextProps?: TextProps
  helper?: TextProps["text"]
  helperTx?: TextProps["tx"]
  helperTxOptions?: TextProps["txOptions"]
  HelperTextProps?: TextProps
  ToggleInput: FC<BaseToggleInputProps<T>>
}

export interface BaseToggleInputProps<T> {
  on: boolean
  status: ToggleProps<T>["status"]
  disabled: boolean
  outerStyle: ViewStyle
  innerStyle: ViewStyle
  detailStyle: ViewStyle | ImageStyle
}

export function Toggle<T>(props: ToggleProps<T>) {
  const {
    editable = true,
    status,
    value,
    onPress,
    onValueChange,
    labelPosition = "right",
    helper,
    helperTx,
    helperTxOptions,
    HelperTextProps,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    ToggleInput,
    accessibilityRole,
    ...WrapperProps
  } = props

  const disabled = editable === false || status === "disabled" || props.disabled

  const Wrapper = useMemo(
    () => (disabled ? View : TouchableOpacity) as ComponentType<TouchableOpacityProps | ViewProps>,
    [disabled],
  )

  const $containerStyles = [$containerStyleOverride]
  const $inputWrapperStyles = [$inputWrapper, $inputWrapperStyleOverride]
  const $helperStyles = [
    $helper,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  function handlePress(e: GestureResponderEvent) {
    if (disabled) return
    onValueChange?.(!value)
    onPress?.(e)
  }

  return (
    <Wrapper
      activeOpacity={1}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ checked: value, disabled }}
      {...WrapperProps}
      style={$containerStyles}
      onPress={handlePress}
    >
      <View style={$inputWrapperStyles}>
        {labelPosition === "left" && <FieldLabel<T> {...props} labelPosition={labelPosition} />}

        <ToggleInput
          on={!!value}
          disabled={!!disabled}
          status={status}
          outerStyle={props.inputOuterStyle ?? {}}
          innerStyle={props.inputInnerStyle ?? {}}
          detailStyle={props.inputDetailStyle ?? {}}
        />

        {labelPosition === "right" && <FieldLabel<T> {...props} labelPosition={labelPosition} />}
      </View>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      )}
    </Wrapper>
  )
}

function FieldLabel<T>(props: ToggleProps<T>) {
  const {
    status,
    label,
    labelTx,
    labelTxOptions,
    LabelTextProps,
    labelPosition,
    labelStyle: $labelStyleOverride,
  } = props

  if (!label && !labelTx && !LabelTextProps?.children) return null

  const $labelStyle = [
    $label,
    status === "error" && { color: colors.error },
    labelPosition === "right" && $labelRight,
    labelPosition === "left" && $labelLeft,
    $labelStyleOverride,
    LabelTextProps?.style,
  ]

  return (
    <Text
      preset="formLabel"
      text={label}
      tx={labelTx}
      txOptions={labelTxOptions}
      {...LabelTextProps}
      style={$labelStyle}
    />
  )
}

const $inputWrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

export const $inputOuterBase: ViewStyle = {
  height: 24,
  width: 24,
  borderWidth: 2,
  alignItems: "center",
  overflow: "hidden",
  flexGrow: 0,
  flexShrink: 0,
  justifyContent: "space-between",
  flexDirection: "row",
}

const $helper: TextStyle = {
  marginTop: spacing[2],
}

const $label: TextStyle = {
  flex: 1,
}

const $labelRight: TextStyle = {
  marginStart: spacing[3],
}

const $labelLeft: TextStyle = {
  marginEnd: spacing[3],
}

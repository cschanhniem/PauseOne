import { ReactElement } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

import { isRTL } from "../i18n"
import { Icon, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"
import { translate } from "../i18n/translate"
import { colors } from "../theme/colors"
import { spacing } from "../theme/spacing"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

export interface HeaderProps {
  titleMode?: "center" | "flex"
  titleStyle?: StyleProp<TextStyle>
  titleContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  backgroundColor?: string
  title?: TextProps["text"]
  titleTx?: TextProps["tx"]
  titleTxOptions?: TextProps["txOptions"]
  leftIcon?: IconTypes
  leftIconColor?: string
  leftText?: TextProps["text"]
  leftTx?: TextProps["tx"]
  LeftActionComponent?: ReactElement
  leftTxOptions?: TextProps["txOptions"]
  onLeftPress?: TouchableOpacityProps["onPress"]
  rightIcon?: IconTypes
  rightIconColor?: string
  rightText?: TextProps["text"]
  rightTx?: TextProps["tx"]
  RightActionComponent?: ReactElement
  rightTxOptions?: TextProps["txOptions"]
  onRightPress?: TouchableOpacityProps["onPress"]
  safeAreaEdges?: ExtendedEdge[]
}

interface HeaderActionProps {
  backgroundColor?: string
  icon?: IconTypes
  iconColor?: string
  text?: TextProps["text"]
  tx?: TextProps["tx"]
  txOptions?: TextProps["txOptions"]
  onPress?: TouchableOpacityProps["onPress"]
  ActionComponent?: ReactElement
}

export function Header(props: HeaderProps) {
  const {
    backgroundColor = colors.background,
    LeftActionComponent,
    leftIcon,
    leftIconColor,
    leftText,
    leftTx,
    leftTxOptions,
    onLeftPress,
    onRightPress,
    RightActionComponent,
    rightIcon,
    rightIconColor,
    rightText,
    rightTx,
    rightTxOptions,
    safeAreaEdges = ["top"],
    title,
    titleMode = "center",
    titleTx,
    titleTxOptions,
    titleContainerStyle: $titleContainerStyleOverride,
    style: $styleOverride,
    titleStyle: $titleStyleOverride,
    containerStyle: $containerStyleOverride,
  } = props

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)

  const titleContent = titleTx ? translate(titleTx, titleTxOptions) : title

  return (
    <View style={[$container, $containerInsets, { backgroundColor }, $containerStyleOverride]}>
      <View style={[$wrapper, $styleOverride]}>
        <HeaderAction
          tx={leftTx}
          text={leftText}
          icon={leftIcon}
          iconColor={leftIconColor}
          onPress={onLeftPress}
          txOptions={leftTxOptions}
          backgroundColor={backgroundColor}
          ActionComponent={LeftActionComponent}
        />

        {!!titleContent && (
          <View
            style={[
              $titleWrapperPointerEvents,
              titleMode === "center" && $titleWrapperCenter,
              titleMode === "flex" && $titleWrapperFlex,
              $titleContainerStyleOverride,
            ]}
          >
            <Text
              weight="bold"
              size="md"
              text={titleContent}
              style={[$title, $titleStyleOverride]}
            />
          </View>
        )}

        <HeaderAction
          tx={rightTx}
          text={rightText}
          icon={rightIcon}
          iconColor={rightIconColor}
          onPress={onRightPress}
          txOptions={rightTxOptions}
          backgroundColor={backgroundColor}
          ActionComponent={RightActionComponent}
        />
      </View>
    </View>
  )
}

function HeaderAction(props: HeaderActionProps) {
  const { backgroundColor, icon, text, tx, txOptions, onPress, ActionComponent, iconColor } = props

  const content = tx ? translate(tx, txOptions) : text

  if (ActionComponent) return ActionComponent

  if (content) {
    return (
      <TouchableOpacity
        style={[$actionTextContainer, { backgroundColor }]}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
      >
        <Text weight="bold" size="md" text={content} style={$actionText} />
      </TouchableOpacity>
    )
  }

  if (icon) {
    return (
      <TouchableOpacity onPress={onPress} style={[$actionIconContainer, { backgroundColor }]}>
        <Icon
          size={24}
          icon={icon}
          color={iconColor}
          style={isRTL ? { transform: [{ rotate: "180deg" }] } : {}}
        />
      </TouchableOpacity>
    )
  }

  return <View style={[$actionFillerContainer, { backgroundColor }]} />
}

const $wrapper: ViewStyle = {
  height: 56,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $container: ViewStyle = {
  width: "100%",
}

const $title: TextStyle = {
  textAlign: "center",
  color: colors.text,
}

const $actionTextContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing[3],
  zIndex: 2,
}

const $actionText: TextStyle = {
  color: colors.tint,
}

const $actionIconContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing[3],
  zIndex: 2,
}

const $actionFillerContainer: ViewStyle = {
  width: 16,
}

const $titleWrapperPointerEvents: ViewStyle = {
  pointerEvents: "none",
}

const $titleWrapperCenter: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  position: "absolute",
  paddingHorizontal: spacing[4],
  zIndex: 1,
}

const $titleWrapperFlex: ViewStyle = {
  justifyContent: "center",
  flexGrow: 1,
}

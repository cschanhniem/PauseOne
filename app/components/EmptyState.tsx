import { Image, ImageProps, ImageStyle, StyleProp, TextStyle, View, ViewStyle } from "react-native"

import { Button, ButtonProps } from "./Button"
import { Text, TextProps } from "./Text"
import { translate } from "../i18n/translate"
import { colors } from "../theme/colors"
import { spacing } from "../theme/spacing"

const sadFace = require("../../assets/images/sad-face.png")

interface EmptyStateProps {
  preset?: "generic"
  style?: StyleProp<ViewStyle>
  imageSource?: ImageProps["source"]
  imageStyle?: StyleProp<ImageStyle>
  ImageProps?: Omit<ImageProps, "source">
  heading?: TextProps["text"]
  headingTx?: TextProps["tx"]
  headingTxOptions?: TextProps["txOptions"]
  headingStyle?: StyleProp<TextStyle>
  HeadingTextProps?: TextProps
  content?: TextProps["text"]
  contentTx?: TextProps["tx"]
  contentTxOptions?: TextProps["txOptions"]
  contentStyle?: StyleProp<TextStyle>
  ContentTextProps?: TextProps
  button?: TextProps["text"]
  buttonTx?: TextProps["tx"]
  buttonOnPress?: ButtonProps["onPress"]
  buttonStyle?: ButtonProps["style"]
  ButtonProps?: ButtonProps
}

interface EmptyStatePresetItem {
  imageSource: ImageProps["source"]
  heading: TextProps["text"]
  content: TextProps["text"]
  button: TextProps["text"]
}

export function EmptyState(props: EmptyStateProps) {
  const EmptyStatePresets = {
    generic: {
      imageSource: sadFace,
      heading: translate("emptyStateComponent:generic.heading"),
      content: translate("emptyStateComponent:generic.content"),
      button: translate("emptyStateComponent:generic.button"),
    } as EmptyStatePresetItem,
  } as const

  const preset = EmptyStatePresets[props.preset ?? "generic"]

  const {
    button = preset.button,
    buttonTx,
    buttonOnPress,
    content = preset.content,
    contentTx,
    contentTxOptions,
    heading = preset.heading,
    headingTx,
    headingTxOptions,
    imageSource = preset.imageSource,
    style: $containerStyleOverride,
    buttonStyle: $buttonStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    imageStyle: $imageStyleOverride,
    ButtonProps,
    ContentTextProps,
    HeadingTextProps,
    ImageProps,
  } = props

  const isImagePresent = !!imageSource
  const isHeadingPresent = !!(heading || headingTx)
  const isContentPresent = !!(content || contentTx)
  const isButtonPresent = !!(button || buttonTx)

  const $containerStyles = [$containerStyleOverride]
  const $imageStyles = [
    $image,
    (isHeadingPresent || isContentPresent || isButtonPresent) && { marginBottom: spacing[1] },
    $imageStyleOverride,
    ImageProps?.style,
  ]
  const $headingStyles = [
    $heading,
    isImagePresent && { marginTop: spacing[1] },
    (isContentPresent || isButtonPresent) && { marginBottom: spacing[1] },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const $contentStyles = [
    $content,
    (isImagePresent || isHeadingPresent) && { marginTop: spacing[1] },
    isButtonPresent && { marginBottom: spacing[1] },
    $contentStyleOverride,
    ContentTextProps?.style,
  ]
  const $buttonStyles = [
    (isImagePresent || isHeadingPresent || isContentPresent) && { marginTop: spacing[4] },
    $buttonStyleOverride,
    ButtonProps?.style,
  ]

  return (
    <View style={$containerStyles}>
      {isImagePresent && (
        <Image source={imageSource} {...ImageProps} style={$imageStyles} tintColor={colors.text} />
      )}

      {isHeadingPresent && (
        <Text
          preset="subheading"
          text={heading}
          tx={headingTx}
          txOptions={headingTxOptions}
          {...HeadingTextProps}
          style={$headingStyles}
        />
      )}

      {isContentPresent && (
        <Text
          text={content}
          tx={contentTx}
          txOptions={contentTxOptions}
          {...ContentTextProps}
          style={$contentStyles}
        />
      )}

      {isButtonPresent && (
        <Button
          onPress={buttonOnPress}
          text={button}
          tx={buttonTx}
          {...ButtonProps}
          style={$buttonStyles}
        />
      )}
    </View>
  )
}

const $image: ImageStyle = { alignSelf: "center" }
const $heading: TextStyle = {
  textAlign: "center",
  paddingHorizontal: spacing[4],
}
const $content: TextStyle = {
  textAlign: "center",
  paddingHorizontal: spacing[4],
}

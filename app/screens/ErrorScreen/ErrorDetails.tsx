import { ErrorInfo } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"

import { Button } from "../../components/Button"
import { Icon } from "../../components/Icon"
import { Screen } from "../../components/Screen"
import { Text } from "../../components/Text"
import { colors } from "../../theme/colors"
import { spacing } from "../../theme/spacing"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$contentContainer}
    >
      <View style={$topSection}>
        <Icon icon="ladybug" size={64} />
        <Text style={$heading} preset="subheading" tx="errorScreen:title" />
        <Text tx="errorScreen:friendlySubtitle" />
      </View>

      <ScrollView style={$errorSection} contentContainerStyle={$errorSectionContentContainer}>
        <Text style={$errorContent} weight="bold" text={`${props.error}`.trim()} />
        <Text
          selectable
          style={$errorBacktrace}
          text={`${props.errorInfo?.componentStack ?? ""}`.trim()}
        />
      </ScrollView>

      <Button style={$resetButton} onPress={props.onReset} tx="errorScreen:reset" />
    </Screen>
  )
}

const $contentContainer: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: spacing[4],
  paddingTop: spacing[4],
  flex: 1,
}

const $topSection: ViewStyle = {
  flex: 1,
  alignItems: "center",
}

const $heading: TextStyle = {
  color: colors.error,
  marginBottom: spacing[3],
}

const $errorSection: ViewStyle = {
  flex: 2,
  backgroundColor: colors.separator,
  marginVertical: spacing[3],
  borderRadius: 6,
}

const $errorSectionContentContainer: ViewStyle = {
  padding: spacing[3],
}

const $errorContent: TextStyle = {
  color: colors.error,
}

const $errorBacktrace: TextStyle = {
  marginTop: spacing[3],
  color: colors.textDim,
}

const $resetButton: ViewStyle = {
  backgroundColor: colors.error,
  paddingHorizontal: spacing[4],
}

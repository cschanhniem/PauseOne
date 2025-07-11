import { useState } from "react"
import { View, ViewStyle } from "react-native"
import * as Sharing from "expo-sharing"
import { Gesture, GestureDetector } from "react-native-gesture-handler"

import { AffirmationCard } from "../components/AffirmationCard"
import { BreathCircle } from "../components/BreathCircle"
import { Button } from "../components/Button"
import { Screen } from "../components/Screen"
import { StreakRing } from "../components/StreakRing"
import { Text } from "../components/Text"
import { useBreathTimer } from "../hooks/useBreathTimer"
import { useStats } from "../hooks/useStats"
import { useStreak } from "../hooks/useStreak"
import { useThemeManager } from "../hooks/useThemeManager"
import { spacing } from "../theme/spacing"

export function HomeScreen() {
  const { isActive, remainingTime, duration, setDuration, start, stop } = useBreathTimer(60)
  const { streak, incrementStreak } = useStreak()
  const { incrementStats } = useStats()
  const { theme, changeTheme } = useThemeManager()
  const [showAffirmation, setShowAffirmation] = useState(false)

  const handleLongPress = () => {
    const durations = [30, 60, 120]
    const currentIndex = durations.indexOf(duration)
    const nextIndex = (currentIndex + 1) % durations.length
    setDuration(durations[nextIndex])
  }

  const handlePress = () => {
    if (isActive) {
      stop()
      setShowAffirmation(true)
    } else {
      setShowAffirmation(false)
      start()
      incrementStreak()
      incrementStats(duration)
    }
  }

  const handleShare = () => {
    Sharing.shareAsync(`https://pause.one/now?duration=${duration}`)
  }

  const flingGesture = Gesture.Fling()
    .direction(1)
    .onEnd(() => {
      changeTheme("right")
    })

  const flingGestureLeft = Gesture.Fling()
    .direction(2)
    .onEnd(() => {
      changeTheme("left")
    })

  const rotateGesture = Gesture.Rotation().onEnd(() => {
    changeTheme("stealth")
  })

  return (
    <GestureDetector gesture={Gesture.Race(flingGesture, flingGestureLeft, rotateGesture)}>
      <Screen
        preset="fixed"
        safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={[$container, { backgroundColor: theme.gradient }]}
      >
        <View style={$topSpacer} />
        {isActive ? <Text text={`${remainingTime}s`} /> : <BreathCircle />}
        <View style={$middleSpacer} />
        <Button
          text={isActive ? "Stop" : `Start ${duration}-Second Pause`}
          onPress={handlePress}
          onLongPress={handleLongPress}
        />
        <Button text="Share a Pause" onPress={handleShare} />
        <View style={$flexSpacer} />
        {streak > 0 && (
          <StreakRing streak={streak} progress={isActive ? remainingTime / duration : 0} />
        )}
        <AffirmationCard visible={showAffirmation} />
      </Screen>
    </GestureDetector>
  )
}

const $container: ViewStyle = {
  flex: 1,
  alignItems: "center",
  paddingHorizontal: spacing[4],
}

const $topSpacer: ViewStyle = {
  height: spacing[4],
}

const $middleSpacer: ViewStyle = {
  height: spacing[4],
}

const $flexSpacer: ViewStyle = {
  flex: 1,
}

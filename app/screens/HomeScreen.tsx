import { useState, useRef } from "react"
import { View, ViewStyle } from "react-native"
import * as Sharing from "expo-sharing"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"

import { ActivityCalendar } from "../components/ActivityCalendar"
import { AffirmationCard } from "../components/AffirmationCard"
import { BreathCircle } from "../components/BreathCircle"
import { Button } from "../components/Button"
import { Screen } from "../components/Screen"
import { StreakRing } from "../components/StreakRing"
import { Text } from "../components/Text"
import { useBreathTimer } from "../hooks/useBreathTimer"
import { useDailyActivity } from "../hooks/useDailyActivity"
import { useStats } from "../hooks/useStats"
import { useStreak } from "../hooks/useStreak"
import { useThemeManager } from "../hooks/useThemeManager"
import { spacing } from "../theme/spacing"

export function HomeScreen() {
  const { isActive, remainingTime, duration, setDuration, start, stop } = useBreathTimer(60)
  const { streak, incrementStreak } = useStreak()
  const { incrementStats } = useStats()
  const { incrementTodayActivity, getRecentActivity } = useDailyActivity()
  const { theme, changeTheme } = useThemeManager()
  const [showAffirmation, setShowAffirmation] = useState(false)
  const longPressInterval = useRef<NodeJS.Timeout | null>(null)
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null)
  const isLongPressing = useRef(false)

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}-Second`
    } else {
      const minutes = Math.floor(seconds / 60)
      return `${minutes}-Minute`
    }
  }

  const cycleDuration = () => {
    const durations = [30, 60, 120, 300, 600, 900]
    setDuration((prevDuration) => {
      const currentIndex = durations.indexOf(prevDuration)
      const nextIndex = (currentIndex + 1) % durations.length
      const newDuration = durations[nextIndex]
      return newDuration
    })
  }

  const handlePressIn = () => {
    if (!isActive) {
      isLongPressing.current = false

      // Start long press timer
      longPressTimeout.current = setTimeout(() => {
        isLongPressing.current = true
        // First change after 500ms
        cycleDuration()

        // Then continue cycling every 800ms
        longPressInterval.current = setInterval(() => {
          cycleDuration()
        }, 800)
      }, 500)
    }
  }

  const handlePressOut = () => {
    // Clear all timers
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }

    if (longPressInterval.current) {
      clearInterval(longPressInterval.current)
      longPressInterval.current = null
    }

    // Reset long press flag after a small delay to prevent normal press
    setTimeout(() => {
      isLongPressing.current = false
    }, 50)
  }

  const handlePress = () => {
    // Only handle normal press if it wasn't a long press
    if (!isLongPressing.current) {
      if (isActive) {
        stop()
        setShowAffirmation(true)
      } else {
        setShowAffirmation(false)
        start()
        incrementStreak()
        incrementStats(duration)
        incrementTodayActivity()
      }
    }
  }

  const handleShare = () => {
    Sharing.shareAsync(`https://pause.one/now?duration=${duration}`)
  }

  const flingGesture = Gesture.Fling()
    .direction(1)
    .onEnd(() => {
      runOnJS(changeTheme)("right")
    })

  const flingGestureLeft = Gesture.Fling()
    .direction(2)
    .onEnd(() => {
      runOnJS(changeTheme)("left")
    })

  const rotateGesture = Gesture.Rotation().onEnd(() => {
    runOnJS(changeTheme)("stealth")
  })

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={[$container, { backgroundColor: theme.gradient }]}
    >
      <GestureDetector gesture={Gesture.Race(flingGesture, flingGestureLeft, rotateGesture)}>
        <View style={$gestureContainer}>
          <View style={$topSpacer} />
          {isActive ? (
            <StreakRing
              streak={streak}
              progress={1 - remainingTime / duration}
              size={220}
              animated={true}
            >
              <Text text={`${remainingTime}s`} preset="heading" />
            </StreakRing>
          ) : (
            <BreathCircle />
          )}
          <View style={$middleSpacer} />
          <Button
            text={isActive ? "Stop" : `Start ${formatDuration(duration)} Pause`}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          />
          <Button text="Share a Pause" onPress={handleShare} />
          <View style={$flexSpacer} />
          {!isActive && <ActivityCalendar activityData={getRecentActivity(49)} />}
          <AffirmationCard visible={showAffirmation} />
        </View>
      </GestureDetector>
    </Screen>
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

const $gestureContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  width: "100%",
}

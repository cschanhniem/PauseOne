import { useEffect, useRef, useState } from "react"
import { Animated, ViewStyle, TextStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { Text } from "./Text"
import { getRandomAffirmation } from "../services/affirmationService"
import { spacing } from "../theme/spacing"
import { color } from "../theme/tokens"

interface AffirmationCardProps {
  visible: boolean
}

export function AffirmationCard({ visible }: AffirmationCardProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const [affirmation, setAffirmation] = useState("")

  useEffect(() => {
    if (visible) {
      const randomAffirmation = getRandomAffirmation()
      setAffirmation(randomAffirmation)
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, opacity])

  const [showCard, setShowCard] = useState(visible)

  useEffect(() => {
    if (visible) {
      setShowCard(true)
    } else {
      const listener = opacity.addListener(({ value }) => {
        if (value === 0) {
          setShowCard(false)
          opacity.removeListener(listener)
        }
      })
    }
  }, [visible, opacity])

  if (!showCard) {
    return null
  }

  return (
    <Animated.View style={[$container, { opacity }]}>
      <LinearGradient
        colors={[color.primaryStart, color.primaryEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={$gradientText}
      >
        <Text text={affirmation} preset="subheading" style={$affirmationText} />
      </LinearGradient>
    </Animated.View>
  )
}

const $container: ViewStyle = {
  marginTop: spacing[3],
  paddingHorizontal: spacing[4],
}

const $gradientText: ViewStyle = {
  borderRadius: 20,
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[3],
}

const $affirmationText: TextStyle = {
  textAlign: "center",
  color: "white",
  fontWeight: "600",
}

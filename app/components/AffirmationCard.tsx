import { useEffect, useRef, useState } from "react"
import { Animated, ViewStyle } from "react-native"

import { GlassCard } from "./GlassCard"
import { Text } from "./Text"

const affirmations = [
  "You are enough.",
  "You are capable of amazing things.",
  "You are in the right place, at the right time.",
  "You are calm and at peace.",
  "You are strong and resilient.",
]

interface AffirmationCardProps {
  visible: boolean
}

export function AffirmationCard({ visible }: AffirmationCardProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const [affirmation, setAffirmation] = useState("")

  useEffect(() => {
    if (visible) {
      const randomIndex = Math.floor(Math.random() * affirmations.length)
      setAffirmation(affirmations[randomIndex])
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
      <GlassCard>
        <Text text={affirmation} />
      </GlassCard>
    </Animated.View>
  )
}

const $container: ViewStyle = {
  position: "absolute",
  top: "50%",
  left: "10%",
  right: "10%",
}

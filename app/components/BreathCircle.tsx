import { useEffect, useRef } from "react"
import { Animated, View, StyleSheet, Easing } from "react-native"
import { Svg, Circle, Defs, LinearGradient, Stop } from "react-native-svg"

import { useReducedMotion } from "../hooks/useReducedMotion"
import { motion, color } from "../theme/tokens"

interface BreathCircleProps {
  size?: number
}

export function BreathCircle({ size = 220 }: BreathCircleProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const isReducedMotion = useReducedMotion()

  useEffect(() => {
    if (isReducedMotion) return

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: motion.breathScale,
          duration: (parseInt(motion.breathDuration, 10) * 1000) / 2,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: (parseInt(motion.breathDuration, 10) * 1000) / 2,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [scaleAnim, isReducedMotion])

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  }

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={color.primaryStart} />
              <Stop offset="100%" stopColor={color.primaryEnd} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2} // Subtract stroke width
            stroke="url(#breathGradient)"
            strokeWidth="4"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  )
}

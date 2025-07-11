import { ReactNode, useEffect, useRef } from "react"
import { View, Animated, StyleSheet, Easing, ViewStyle } from "react-native"
import { Svg, Circle, Defs, LinearGradient, Stop } from "react-native-svg"

import { useReducedMotion } from "../hooks/useReducedMotion"
import { color, motion } from "../theme/tokens"

interface StreakRingProps {
  size?: number
  streak?: number
  progress?: number // 0 to 1
  children?: ReactNode
  animated?: boolean // Enable breathing animation
  intensity?: number // 0-4 for GitHub-style intensity (0=no activity, 4=very high)
}

export function StreakRing({
  size = 120,
  streak: _streak = 0,
  progress = 0,
  children,
  animated = false,
  intensity = 0,
}: StreakRingProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  const scaleAnim = useRef(new Animated.Value(1)).current
  const isReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!animated || isReducedMotion) return

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
  }, [scaleAnim, isReducedMotion, animated])

  const animatedStyle = animated
    ? {
        transform: [{ scale: scaleAnim }],
      }
    : {}

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0:
        return color.glass // No activity
      case 1:
        return `url(#intensity1)` // Light
      case 2:
        return `url(#intensity2)` // Medium
      case 3:
        return `url(#intensity3)` // High
      case 4:
        return `url(#intensity4)` // Very high
      default:
        return color.glass
    }
  }

  const ringColor = animated ? "url(#breathGradient)" : getIntensityColor(intensity)

  return (
    <View style={[$containerStyle, { width: size, height: size }]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Svg width={size} height={size} style={$svgStyle}>
          <Defs>
            <LinearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={color.primaryStart} />
              <Stop offset="100%" stopColor={color.primaryEnd} />
            </LinearGradient>
            {/* GitHub-style intensity gradients */}
            <LinearGradient id="intensity1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="rgba(76, 144, 255, 0.3)" />
              <Stop offset="100%" stopColor="rgba(101, 249, 213, 0.3)" />
            </LinearGradient>
            <LinearGradient id="intensity2" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="rgba(76, 144, 255, 0.5)" />
              <Stop offset="100%" stopColor="rgba(101, 249, 213, 0.5)" />
            </LinearGradient>
            <LinearGradient id="intensity3" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="rgba(76, 144, 255, 0.7)" />
              <Stop offset="100%" stopColor="rgba(101, 249, 213, 0.7)" />
            </LinearGradient>
            <LinearGradient id="intensity4" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={color.primaryStart} />
              <Stop offset="100%" stopColor={color.primaryEnd} />
            </LinearGradient>
          </Defs>
          {/* Background Circle */}
          <Circle
            stroke={color.glass}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <Circle
            stroke={ringColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </Animated.View>
      {children}
    </View>
  )
}

const $containerStyle: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $svgStyle: ViewStyle = {
  position: "absolute",
}

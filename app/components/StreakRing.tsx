import { View } from "react-native"
import { Svg, Circle, Defs, LinearGradient, Stop } from "react-native-svg"

import { color } from "../theme/tokens"

interface StreakRingProps {
  size?: number
  streak?: number
  progress?: number // 0 to 1
}

export function StreakRing({ size = 120, streak = 0, progress = 0 }: StreakRingProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  const useGradient = streak > 7
  const ringColor = useGradient ? "url(#streakGradient)" : color.glass

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color.secondaryStart} stopOpacity="1" />
            <Stop offset="100%" stopColor={color.secondaryEnd} stopOpacity="1" />
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
    </View>
  )
}

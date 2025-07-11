import { useState, useEffect } from "react"
import { AccessibilityInfo } from "react-native"

export const useReducedMotion = () => {
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (isReduceMotionEnabled) => {
        setIsReducedMotion(isReduceMotionEnabled)
      },
    )

    return () => {
      subscription.remove()
    }
  }, [])

  return isReducedMotion
}

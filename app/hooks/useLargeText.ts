import { useState, useEffect } from "react"
import { AccessibilityInfo } from "react-native"

export const useLargeText = () => {
  const [isLargeText, setIsLargeText] = useState(false)

  useEffect(() => {
    const subscription = AccessibilityInfo.addEventListener(
      "boldTextChanged",
      (isBoldTextEnabled) => {
        setIsLargeText(isBoldTextEnabled)
      },
    )

    return () => {
      subscription.remove()
    }
  }, [])

  return isLargeText
}

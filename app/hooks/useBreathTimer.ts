import { useState, useEffect, useRef } from "react"
import * as Haptics from "expo-haptics"

export const useBreathTimer = (initialDuration: number) => {
  const [duration, setDuration] = useState(initialDuration)
  const [isActive, setIsActive] = useState(false)
  const [remainingTime, setRemainingTime] = useState(duration)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive) {
      Haptics.selectionAsync()
      timerRef.current = setInterval(() => {
        Haptics.selectionAsync()
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!)
            setIsActive(false)
            return duration
          }
          return prevTime - 1
        })
      }, 4000) // 4 seconds inhale, 4 seconds exhale
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isActive, duration])

  const start = () => {
    setRemainingTime(duration)
    setIsActive(true)
  }

  const stop = () => {
    setIsActive(false)
    setRemainingTime(duration)
  }

  return { isActive, remainingTime, duration, setDuration, start, stop }
}

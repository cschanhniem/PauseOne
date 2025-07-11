import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const STREAK_KEY = "streak"
const LAST_PAUSE_KEY = "last_pause"

export const useStreak = () => {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const loadStreak = async () => {
      const now = new Date().getTime()
      const lastPause = await AsyncStorage.getItem(LAST_PAUSE_KEY)
      const lastPauseTime = lastPause ? parseInt(lastPause, 10) : 0

      if (now - lastPauseTime > 24 * 60 * 60 * 1000) {
        setStreak(0)
      } else {
        const storedStreak = await AsyncStorage.getItem(STREAK_KEY)
        setStreak(storedStreak ? parseInt(storedStreak, 10) : 0)
      }
    }

    loadStreak()
  }, [])

  const incrementStreak = async () => {
    const newStreak = streak + 1
    setStreak(newStreak)
    await AsyncStorage.setItem(STREAK_KEY, newStreak.toString())
    await AsyncStorage.setItem(LAST_PAUSE_KEY, new Date().getTime().toString())
  }

  return { streak, incrementStreak }
}

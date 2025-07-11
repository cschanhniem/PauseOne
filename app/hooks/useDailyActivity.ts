import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const DAILY_ACTIVITY_KEY = "daily_activity"

interface DailyActivity {
  [dateKey: string]: number // dateKey format: "YYYY-MM-DD", value is pause count
}

export const useDailyActivity = () => {
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>({})

  useEffect(() => {
    const loadDailyActivity = async () => {
      const stored = await AsyncStorage.getItem(DAILY_ACTIVITY_KEY)
      if (stored) {
        setDailyActivity(JSON.parse(stored))
      }
    }

    loadDailyActivity()
  }, [])

  const getTodayKey = () => {
    const today = new Date()
    return today.toISOString().split("T")[0] // YYYY-MM-DD format
  }

  const incrementTodayActivity = async () => {
    const todayKey = getTodayKey()
    const currentCount = dailyActivity[todayKey] || 0
    const newActivity = {
      ...dailyActivity,
      [todayKey]: currentCount + 1,
    }

    setDailyActivity(newActivity)
    await AsyncStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(newActivity))
  }

  const getTodayCount = () => {
    const todayKey = getTodayKey()
    return dailyActivity[todayKey] || 0
  }

  const getTodayIntensity = () => {
    const count = getTodayCount()
    if (count === 0) return 0
    if (count <= 2) return 1 // Light activity
    if (count <= 5) return 2 // Medium activity
    if (count <= 10) return 3 // High activity
    return 4 // Very high activity
  }

  const getRecentActivity = (days: number = 7) => {
    const recent: Array<{ date: string; count: number; intensity: number }> = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split("T")[0]
      const count = dailyActivity[dateKey] || 0
      const intensity = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4

      recent.push({ date: dateKey, count, intensity })
    }

    return recent
  }

  return {
    dailyActivity,
    incrementTodayActivity,
    getTodayCount,
    getTodayIntensity,
    getRecentActivity,
  }
}

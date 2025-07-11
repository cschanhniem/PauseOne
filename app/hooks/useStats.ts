import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const TOTAL_PAUSES_KEY = "total_pauses"
const TOTAL_TIME_KEY = "total_time"

export const useStats = () => {
  const [totalPauses, setTotalPauses] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    const loadStats = async () => {
      const storedTotalPauses = await AsyncStorage.getItem(TOTAL_PAUSES_KEY)
      setTotalPauses(storedTotalPauses ? parseInt(storedTotalPauses, 10) : 0)

      const storedTotalTime = await AsyncStorage.getItem(TOTAL_TIME_KEY)
      setTotalTime(storedTotalTime ? parseInt(storedTotalTime, 10) : 0)
    }

    loadStats()
  }, [])

  const incrementStats = async (duration: number) => {
    const newTotalPauses = totalPauses + 1
    setTotalPauses(newTotalPauses)
    await AsyncStorage.setItem(TOTAL_PAUSES_KEY, newTotalPauses.toString())

    const newTotalTime = totalTime + duration
    setTotalTime(newTotalTime)
    await AsyncStorage.setItem(TOTAL_TIME_KEY, newTotalTime.toString())
  }

  return { totalPauses, totalTime, incrementStats }
}

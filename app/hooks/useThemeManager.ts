import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const THEME_KEY = "theme"

const themes = [
  {
    name: "Default",
    gradient: "linear-gradient(135deg,#4C90FF 0%,#65F9D5 100%)",
  },
  {
    name: "Sunset",
    gradient: "linear-gradient(135deg,#FF8C00 0%,#F0E68C 100%)",
  },
  {
    name: "Ocean",
    gradient: "linear-gradient(135deg,#1E90FF 0%,#00BFFF 100%)",
  },
  {
    name: "Forest",
    gradient: "linear-gradient(135deg,#228B22 0%,#32CD32 100%)",
  },
  {
    name: "Candy",
    gradient: "linear-gradient(135deg,#FF69B4 0%,#FFC0CB 100%)",
  },
  {
    name: "Stealth",
    gradient: "linear-gradient(135deg,#FFFFFF 0%,#CCCCCC 100%)",
  },
]

export const useThemeManager = () => {
  const [theme, setTheme] = useState(themes[0])

  useEffect(() => {
    const loadTheme = async () => {
      const storedThemeName = await AsyncStorage.getItem(THEME_KEY)
      const storedTheme = themes.find((t) => t.name === storedThemeName)
      if (storedTheme) {
        setTheme(storedTheme)
      }
    }

    loadTheme()
  }, [])

  const changeTheme = (direction: "left" | "right" | "stealth") => {
    if (direction === "stealth") {
      const stealthTheme = themes.find((t) => t.name === "Stealth")
      if (stealthTheme) {
        setTheme(stealthTheme)
        AsyncStorage.setItem(THEME_KEY, stealthTheme.name)
      }
      return
    }

    const currentIndex = themes.findIndex((t) => t.name === theme.name)
    const nextIndex =
      direction === "right"
        ? (currentIndex + 1) % (themes.length - 1) // Exclude stealth mode from regular rotation
        : (currentIndex - 1 + (themes.length - 1)) % (themes.length - 1)
    const newTheme = themes[nextIndex]
    setTheme(newTheme)
    AsyncStorage.setItem(THEME_KEY, newTheme.name)
  }

  return { theme, changeTheme }
}

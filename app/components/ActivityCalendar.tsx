import { View, ViewStyle, TextStyle } from "react-native"

import { Text } from "./Text"
import { spacing } from "../theme/spacing"
import { color } from "../theme/tokens"

interface ActivityCalendarProps {
  activityData: Array<{ date: string; count: number; intensity: number }>
  weeks?: number
}

export function ActivityCalendar({ activityData, weeks: _weeks = 7 }: ActivityCalendarProps) {
  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return color.glass
      case 1:
        return "rgba(76, 144, 255, 0.3)"
      case 2:
        return "rgba(76, 144, 255, 0.5)"
      case 3:
        return "rgba(76, 144, 255, 0.7)"
      case 4:
        return color.primaryStart
      default:
        return color.glass
    }
  }

  // Group data into weeks (7 days each)
  const groupIntoWeeks = () => {
    const weekGroups = []
    for (let i = 0; i < activityData.length; i += 7) {
      weekGroups.push(activityData.slice(i, i + 7))
    }
    return weekGroups
  }

  const weekGroups = groupIntoWeeks()

  return (
    <View style={$container}>
      <Text text="Activity" preset="subheading" style={$title} />
      <View style={$calendarGrid}>
        {weekGroups.map((week, weekIndex) => (
          <View key={weekIndex} style={$weekColumn}>
            {week.map((day, dayIndex) => (
              <View
                key={`${weekIndex}-${dayIndex}`}
                style={[$daySquare, { backgroundColor: getIntensityColor(day.intensity) }]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={$legend}>
        <Text text="Less" style={$legendText} />
        <View style={$legendSquares}>
          {[0, 1, 2, 3, 4].map((intensity) => (
            <View
              key={intensity}
              style={[$legendSquare, { backgroundColor: getIntensityColor(intensity) }]}
            />
          ))}
        </View>
        <Text text="More" style={$legendText} />
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  alignItems: "center",
  paddingVertical: spacing[3],
}

const $title: ViewStyle = {
  marginBottom: spacing[2],
  opacity: 0.8,
}

const $calendarGrid: ViewStyle = {
  flexDirection: "row",
  gap: 2,
}

const $weekColumn: ViewStyle = {
  flexDirection: "column",
  gap: 2,
}

const $daySquare: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 2,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.1)",
}

const $legend: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing[2],
  gap: spacing[1],
}

const $legendSquares: ViewStyle = {
  flexDirection: "row",
  gap: 2,
}

const $legendSquare: ViewStyle = {
  width: 8,
  height: 8,
  borderRadius: 1,
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.1)",
}

const $legendText: TextStyle = {
  fontSize: 12,
  opacity: 0.6,
}

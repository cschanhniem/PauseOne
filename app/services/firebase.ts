import { Platform } from "react-native"
import messaging from "@react-native-firebase/messaging"

export const requestUserPermission = async () => {
  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    if (enabled) {
      console.log("Authorization status:", authStatus)
    }
  } else if (Platform.OS === "android") {
    // Dynamically import PermissionsAndroid only when needed on Android
    const { PermissionsAndroid } = await import("react-native")
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  }
}

export const getFCMToken = async () => {
  const token = await messaging().getToken()
  console.log("FCM Token:", token)
  return token
}

export const onNotification = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log("A new FCM message arrived!", JSON.stringify(remoteMessage))
  })

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("onNotificationOpenedApp", JSON.stringify(remoteMessage))
  })

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("getInitialNotification", JSON.stringify(remoteMessage))
      }
    })
}

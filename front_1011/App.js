import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import store from "./src/redux/store";
import AppNavigator from "./src/AppNavigator";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Device from "expo-device";
import { useRef } from "react";
import Constants from "expo-constants";
import { Button } from "react-native";
import API from "./src/redux/API";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function loadFonts() {
    await Font.loadAsync({
      ArialBold: require("./assets/fonts/ArialBold.ttf"), //700
    });
    setFontLoaded(true);
  }
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontLoaded) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <AppNavigator />
          {/* <Button
            title="Press to schedule a notification"
            onPress={async () => {
              await schedulePushNotification(expoPushToken);
            }}
          /> */}
          <StatusBar style="auto" hidden={false} backgroundColor="#ffcc33" />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

async function schedulePushNotification(expoPushToken) {
  // const expoPushToken='ExponentPushToken[wf3fTiK1-0qLCmeTMnNYyR]'



  const token='AAAAvhte2-c:APA91bFql9OMcABNDtCVbt6-t0Fqal8RzDJgQFnmUVyX8PQVZNVmDzztq6eXNRc64gfcg33bGN10Ly09QoQvMuiFfNHh1BBhGlITvbL8fhyV9q8z2UCXeFZriBcsk_id--vtupyXoSlD'
  API.post("/notification/send", {
    pushToken: expoPushToken,
    title: "You've got mail! 📬",
    body: "Here is the notification body",
  }).then((response) => {
    console.log("done");
    Toast.show("Notification sent successfully", {
      type: "success",
    });

  }
  ).catch((error)=>{
    console.log("error")
    Toast.show("Notification sent failed", {
      type: "danger",
    });
  }
  )


  // await fetch("https://fcm.googleapis.com/fcm/send", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     // Authorization: `key=<FCM-SERVER-KEY>`,
  //     Authorization: `key=${token}`,
  //   },
  //   body: JSON.stringify({
  //     to: "ExponentPushToken[wf3fTiK1-0qLCmeTMnNYyR]",
  //     priority: "normal",
  //     data: {
  //       experienceId: "jbjesusjb/socialapp",
  //       scopeKey: "jbjesusjb/socialapp",
  //       title: "📧 You've got mail",
  //       message: "Hello world! 🌐",
  //     },
  //   }),
  // }).then((response) => {
  //   console.log("done");
  // }
  // ).catch((error)=>{
  //   console.log("error")
  // })
  // await Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: "You've got mail! 📬",
  //     body: "Here is the notification body",
  //     data: { data: "goes here" },
  //   },
  //   trigger: { seconds: 2 },
  // });
}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
    console.log(token);
    await AsyncStorage.setItem("expoPushToken", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

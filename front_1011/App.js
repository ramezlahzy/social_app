import { useEffect, useState } from "react";
//import { StatusBar } from 'expo-status-bar';
import { StatusBar, StyleSheet, Text, View } from "react-native";
import store from "./src/redux/store";
import AppNavigator from "./src/AppNavigator";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// async function sendNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'Notification Title',
//       body: 'Notification Body',
//     },
//     trigger: null, // To display immediately
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = await Notifications.getExpoPushTokenAsync({});
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  async function loadFonts() {
    await Font.loadAsync({
      ArialBold: require("./assets/fonts/ArialBold.ttf"), //700
    });
    setFontLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontLoaded) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <AppNavigator />
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

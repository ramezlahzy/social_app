import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Image } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import LoginScreen from "./auth/login";
import { Provider } from "react-redux";
import store from "./redux/store";
import MainScreen from "./screen/main";
import Users from "./screen/users";
import Notification from "./screen/notification";
import WhatILearned from "./screen/whatILearned";
import Reported from "./screen/reported";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Users"
              component={Users}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Notification"
              component={Notification}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="WhatILearned"
              component={WhatILearned}
              options={{ headerShown: true }}
            />
               <Stack.Screen
              name="Reported"
              component={Reported}
              options={{ headerShown: true }}
            />
            
            
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  tabImg: {
    width: 24,
    height: 24,
  },
});

export default AppNavigator;

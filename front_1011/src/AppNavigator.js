import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Image } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import WhatIlearnedScreen from "./screens/whatilearned/index.js";
import store from "./redux/store";
import LoginScreen from "./screens/auth/LoginScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import InviteScreen from "./screens/invite";
import { Provider } from "react-redux";
import MainScreen from "./screens/main/index.js";
import ProfileScreen from "./screens/profile/ProfileScreen.js";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="PhoneVerify">
            <Stack.Screen
              name="PhoneVerify"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Invite"
              component={InviteScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="whatilearned"
              component={MainScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
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

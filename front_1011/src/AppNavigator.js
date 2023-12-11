import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Image } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import WhatIlearnedScreen from './screens/whatilearned/index.js'
import store from "./redux/store";
import LoginScreen from "./screens/auth/LoginScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import InviteScreen from './screens/invite';
import { Provider } from "react-redux";

const Stack = createStackNavigator();


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
              component={WhatIlearnedScreen}
              options={{ headerShown: false }}
            />
          
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
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

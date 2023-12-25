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
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const TopTabNavigator = createMaterialTopTabNavigator();

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const Main = () => {
    return (
      <TopTabNavigator.Navigator>
        <TopTabNavigator.Screen
          name="MainScreen"
          component={MainScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="home"
                size={24}
                color={focused ? "#F31B1B" : "#4388CC"}
              />
            ),
          }}
        />
     
        <TopTabNavigator.Screen
          name="Users"
          component={Users}
          options={{
            headerShown: true,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="users"
                size={24}
                color={focused ? "#F31B1B" : "#4388CC"}
              />
            ),
          }}
        />

        <TopTabNavigator.Screen
          name="Notification"
          component={Notification}
          options={{
            headerShown: true,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name="notification"
                size={24}
                color={focused ? "#F31B1B" : "#4388CC"}
              />
            ),
          }}
        />
        <TopTabNavigator.Screen
          name="WhatILearned"
          component={WhatILearned}
          options={{
            headerShown: true,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="open-book"
                size={24}
                color={focused ? "#F31B1B" : "#4388CC"}
              />
            ),
          }}
        />
        <TopTabNavigator.Screen
          name="Reported"
          component={Reported}
          options={{
            headerShown: true,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="warning"
                size={24}
                color={focused ? "#F31B1B" : "#4388CC"}
              />
            ),
          }}
        />

       
      </TopTabNavigator.Navigator>
    );
  };
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
              name="Main"
              component={Main}
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import FriendScreen from "./friend";
import WhatILearnedScreen from "./whatilearned";
import FavoriteScreen from "./favorite";
import NotificationScreen from "./notification";
import HeartImg from "../../../assets/image/heart.png";
import HeartFullImg from "../../../assets/image/heartfull.png";
import NotificationImg from "../../../assets/image/notification.png";
import NotificationFullImg from "../../../assets/image/notificationfull.png";
import API from "../../redux/API";
import ChatScreen from "./chat/Chat";
import Line from "../../../assets/image/line.png";
import Message from "../../../assets/image/message.png";
const TopTabNavigator = createMaterialTopTabNavigator();


const CustomTabBarIcon = ({ focused }) => {
  const [isFull, setIsFull] = useState(focused);

  const toggleHeartIcon = () => {
    setIsFull((prevState) => !prevState);
  };
  return (
    <Image
      style={{
        width: 20,
        height: 20,
      }}
      source={isFull ? HeartFullImg : HeartImg}
      onClick={toggleHeartIcon}
    />
  );
};

const ChatTabBarIcon = ({ focused }) => {
  const [isFull, setIsFull] = useState(focused);

  const toggleHeartIcon = () => {
    setIsFull((prevState) => !prevState);
  };
  return (
    <View>
      <Image source={ Message } 
      style={{
        width: 20,
        height: 20,
        resizeMode: 'contain',
        // marginBottom: 5,
      }}

      />
      {
        isFull && <Image source={ Line }
        style={{
          width: 20,
          height: 20,
          resizeMode: 'contain',
         
        }}
        />
      }
    </View>
  );
};


const CustomTabLabelWithBadge = ({ badgeCount, focused }) => {
  const [isFull, setIsFull] = useState(focused);

  const toggleHeartIcon = () => {
    setIsFull((prevState) => !prevState);
  };
  return (
    <View>
      <Image source={isFull ? NotificationFullImg : NotificationImg} />

      {badgeCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -5,
            right: -5, // Adjust the position as needed
            color: "red", // Badge background color
          }}
        >
          <Text style={{ color: "red", fontSize: 16, fontWeight: "700" }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const MainScreen = () => {
  const [notification, setNotification] = useState({
    notification: [],
    count: 0,
  });
  useEffect(() => {
    API.get("user/notification")
      .then((res) => {
        setNotification(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const NotificationScreenComponent = () => {
    return (
      <NotificationScreen
        notification={notification}
        setNotification={setNotification}
      ></NotificationScreen>
    );
  };
  return (
    <TopTabNavigator.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#F31B1B",
        tabBarInactiveTintColor: "#4388CC",
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 16,
          lineHeight: 18.4,
          borderBottomWidth: 2,
          borderBottomColor: "#4388CC",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#ffffff",
        },
        tabBarStyle: {
          backgroundColor: "#ffffff", // You can change this to your desired background color
          borderBottomWidth: 2,
          borderBottomColor: "#4388CC",
          paddingVertical: 2,
        },
        tabBarItemStyle: { width: "100%", alignItems: "center" },
      }}
    >
      <TopTabNavigator.Screen
        name="Friends"
        component={FriendScreen}
        options={{
          title: "Friends",
          tabBarLabelStyle: {
            textTransform: "none",
            fontWeight: "700",
            fontSize: 16,
            lineHeight: 18.4,
          },
        }}
      />
      <TopTabNavigator.Screen
        name="WHAT I LEARNED"
        component={WhatILearnedScreen}
        options={{
          tabBarLabel: "WHAT I LEARNED",
          tabBarLabelStyle: {
            textTransform: "none",
            fontWeight: "700",
            fontSize: 16,
            lineHeight: 18.4,
          },
        }}
      />
      
      <TopTabNavigator.Screen
        name="chat"
        component={ChatScreen}
        options={{
          title: "",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => <ChatTabBarIcon focused={focused} />,
        }}
      />
      <TopTabNavigator.Screen
        name="favorite"
        component={FavoriteScreen}
        options={{
          title: "",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => <CustomTabBarIcon focused={focused} />,
        }}
      />
      <TopTabNavigator.Screen
        name="notification"
        component={NotificationScreenComponent}
        options={{
          title: "",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <CustomTabLabelWithBadge
              focused={focused}
              badgeCount={notification?.count}
            />
          ),
        }}
      />
    </TopTabNavigator.Navigator>
  );
};

export default MainScreen;

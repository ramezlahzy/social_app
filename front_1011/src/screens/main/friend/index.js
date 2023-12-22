import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FriendByLocation from './friend_bylocation'
import FriendByName from './friend_byname'
import MyProfile from "./myProfile";

const TopTabNavigator = createMaterialTopTabNavigator();


const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 2, borderBottomColor: '#4388CC' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;

        let tabStyle = {
          flex: 1,
          alignItems: 'center',
          paddingVertical: 12,
        };
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            key={route.key}
            style={{
              ...tabStyle,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text style={{ color: isFocused ? '#2E8B57' : '#4388CC', fontWeight: '700', fontSize: 16, lineHeight: 18.4, borderBottomWidth: isFocused ? 2 : 0,
                    borderBottomColor: '#2E8B57'}} onPress={onPress}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};


const App = () => {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="MY PROFILE" component={MyProfile} />
      <Tab.Screen name="BY NAME" component={FriendByName} />
      <Tab.Screen name="BY LOCATION" component={FriendByLocation} />
    </Tab.Navigator>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 20,
    // fontFamily: 'ArialBold'
  },
  input: {
    fontFamily: 'ArialBold',
    borderWidth: 2,
    paddingHorizontal: 8,
    fontWeight: '700',
    lineHeight: 18.4,
    borderColor: "#4388CC",
    color: '#4388CC',
    width: "90%",
    fontSize: 16,
    height: 26,
  },
});

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
import WhatIlearnedList from "./whatilearned_list";
import WhatIlearnedCreate from "./whatilearned_create";
import WhatIlearnedWithWorldWide from "./learnedWorldWide";
import WhatIlearnedWithFriends from "./learnedFriends";
import WhatIlearnedWithAll from "./learnedAll";
const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 2, borderBottomColor: '#4388CC' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;

        let tabStyle = {
          //john
          //flex: 1,
          alignItems: 'center',
          paddingVertical: 12,
        };

        // Adjust width for specific tabs
        if (route.name === 'FRIENDS') {
          tabStyle = { ...tabStyle, width: "28%" };
        } else if (route.name === 'WORLDWIDE') {
          tabStyle = { ...tabStyle, width: "37%" };
        } else if (route.name === 'ALL') {
          tabStyle = { ...tabStyle, width: "18%" };
        } else if (route.name === 'ADD+') {
          tabStyle = { ...tabStyle, width: "17%"};
        }

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
            <Text style={{ color: isFocused ? '#F31B1B' : '#4388CC', fontWeight: '700', fontSize: 16, lineHeight: 18.4, borderBottomWidth: isFocused ? 2 : 0,
                    borderBottomColor: '#F31B1B'}} onPress={onPress}>
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
      <Tab.Screen name="FRIENDS" component={WhatIlearnedWithFriends} />
      <Tab.Screen name="WORLDWIDE" component={WhatIlearnedWithWorldWide} />
      <Tab.Screen name="ALL" component={WhatIlearnedWithAll} />
      <Tab.Screen name="ADD+" component={WhatIlearnedCreate} />
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
    fontFamily: 'ArialBold',
    fontSize: 16,
    height: 26,
  },
});

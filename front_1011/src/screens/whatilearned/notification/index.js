import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList, // Import FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import API from "../../../redux/API";
import { useFocusEffect } from "@react-navigation/native";
import { differenceInMinutes } from "date-fns";
import { useToast } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";
import Bell from "../../../../assets/image/bell.png";

export default ({ notification, setNotification }) => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      if (notification.count > 0) {
        API.get("user/setNotificationViewed")
          .then((res) => {
            setNotification({ notification: res.data.notification, count: 0 });
            // console.log(res.data)
            console.log("Notification ", res.data.notification);
          })
          .catch((err) => console.log(JSON.stringify(err)));
      }
    }, [])
  );
  console.log("Notification ", notification);
  const formatDateTime = (datetimeString) => {
    const date = new Date(datetimeString);

    // Extract date components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format as "hh:mm MM/DD/YYYY"
    const formattedDateTime = `${hours}:${minutes} ${month}/${day}/${year}`;

    return formattedDateTime;
  };
  const timeAgo = (minutes) => {
    if (minutes < 1) {
      return "just now";
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={notification.notification}
        renderItem={({ item, index }) => {
          const nowDate = new Date();
          const minutes = -differenceInMinutes(item.createdAt, nowDate);
          const getTime = timeAgo(minutes);
          return (
            <>
              {index == 0 && (
                <Image
                  source={Bell}
                  style={{
                    width: 200,
                    height: 200,
                    alignSelf: "center",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              )}
              <View
                style={{
                  marginHorizontal: 10,
                }}
              >
                <View
                  // style={
                  //   item.viewed
                  //     ? styles.readNotification
                  //     : styles.unreadNotification
                  // }
                  style={{
                    backgroundColor: "#FFFFFF",
                    margin: 10,
                    padding: 10,
                    borderRadius: 20,
                    borderColor: "#4388CC",
                    shadowColor: "#000000",
                    marginHorizontal: 10,
                    shadowOffset: {
                      width: 3,
                      height: 5,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                    elevation: 5,
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                    disabled={!item.content.includes("WhatILearned")}
                    onPress={() => {
                      navigate.navigate("whatilearned", {
                        screen: "Friends",
                        params: {
                          screen: "MY PROFILE",
                          params: { id: item.data },
                        },
                      });
                    }}
                  >
                    {/* <Image
                    source={{ uri: item.avatar }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "grey",
                      marginRight: 10,

                    }}
                  /> */}
                    <AntDesign
                      name="notification"
                      size={24}
                      color="grey"
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 3, margin: 10, gap: 3 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "grey",
                          flex: 1,
                        }}
                      >
                        {item.type}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          color: "#4388CC",
                        }}
                      >
                        {item.content}
                      </Text>
                    </View>

                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: 10,
                        color: "grey",
                        marginTop: 5,
                        alignSelf: "center",
                        margin: 10,
                      }}
                    >
                      {getTime}
                    </Text>
                  </TouchableOpacity>

                  {/* {item.viewed ? null : (
                  <TouchableOpacity onPress={() => markNotificationAsRead(item.id)}>
                    
                  </TouchableOpacity>
                )} */}
                </View>
              </View>
            </>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  readNotification: {
    borderWidth: 2,
    borderColor: "#DDAA11", // Read notification background color
    padding: 20,
    flexDirection: "row",
  },
  unreadNotification: {
    backgroundColor: "#DDAA11", // Unread notification background color
    padding: 20,
    flexDirection: "row",
    color: "#4388CC",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // fontFamily: 'ArialBold'
  },
});

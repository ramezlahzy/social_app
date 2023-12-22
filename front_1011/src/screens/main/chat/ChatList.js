import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/selectors";
import { Text } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import API from "../../../redux/API";
import { FlatList } from "react-native";
import { View } from "react-native";
import { Image } from "react-native";
import { IMG_URL } from "../../../config";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { differenceInMinutes } from "date-fns";
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

const ChatList = () => {
  const user = useSelector(selectUser);
  const [lastMessage, setLastMessage] = useState(["empty"]);
  const navigate = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    console.log("begin loop");
    API.post("message/getLastMessages")
      .then((response) => {
        const temp = ["empty", ...response.data.messages];
        setLastMessage(temp);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log("error", error);
        setRefreshing(false);
      });
  };
  useEffect(() => {
    onRefresh();
  }, []);
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 18,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <FlatList
        data={lastMessage}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={(item, index) => index.toString()}
        style={{
          width: "100%",
          height: "80%",
          backgroundColor: "#fff",
          borderRadius: 10,
          //   padding: 10,
          marginBottom: 90,
        }}
        renderItem={({ item, index }) => {
          const nowDate = new Date();
          const minutes = -differenceInMinutes(item.createdAt, nowDate);
          const getTime = timeAgo(minutes);
          const friendID =
            item.fromUserID === user.id ? item.toUserID : item.fromUserID;
          return (
            <>
              {index === 0 && lastMessage.length === 1 && (
                <View
                  style={{
                    // flex: 1,
                    // justifyContent: "center",
                    // alignItems: "center",
                    // width: "100%",
                    // height: "100%",
                    // position: "absolute",
                    // top: 0,
                    // left: 0,
                    // backgroundColor: "white",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: "grey",
                      textAlign: "center",
                    }}
                  >
                    You don't have any chat yet
                  </Text>
                </View>
              )}
              {index !== 0 && (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    display: "flex",
                    marginBottom: 10,
                    width: "100%",
                    display: "flex",
                    minHeight: 105,
                    // flexDirection: item.fromUserID !== user.id ? "row" : "row-reverse",
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 10,
                  }}
                  onPress={() => {
                    navigate.navigate("whatilearned", {
                      screen: "chat",
                      params: {
                        screen: "OneChat",
                        params: {
                          // friendAvatar: friend?.friendAvatar,
                          // friendID: friend?.friendID,
                          // friendName: friend?.friendName,
                          // //  distance: distance.toFixed(2),
                          // isFollowed: friend?.isFollowed,
                          friendAvatar: item.friendAvatar,
                          friendID,
                          friendName: item.friendName,
                          distance: item.friendDistance.toFixed(2),
                          isFollowed: item.isFollowed,
                        },
                      },
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: IMG_URL + item.friendAvatar }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                        backgroundColor: "grey",
                        margin: 10,
                        borderColor: "#4388CC",
                        borderWidth: item.fromUserID !== user.id ? 3 : 0,
                      }}
                    />
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 16,
                        color: "#4388CC",
                        marginBottom: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {item.friendName}
                    </Text>
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 12,
                        color: "#2E8B57",
                        marginBottom: 10,
                        fontWeight: 700,
                      }}
                    >
                      {item.friendDistance.toFixed(2)} mile from you
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center",
                      paddingBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: "#F31B1B",
                        fontWeight: 700,
                        textAlign: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        flex: 1,
                        alignItems: "center",
                        textAlignVertical: "center",
                        fontSize: 16,
                      }}
                    >
                      {item.message}
                    </Text>

                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 16,
                        color: "#4388CC",
                        marginBottom: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {getTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: "#D9D9D9",
                }}
              />
            </>
          );
        }}
      />
    </View>
  );
};
export default ChatList;

import React, { useEffect } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/selectors";
import { useRoute } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import API from "../../../redux/API";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import { IMG_URL, API_BASE } from "../../../config";
// import {format} from 'date-fns'
import formatDistanceToNow from "date-fns/formatDistanceToNow";
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

export default OneChat = ({ navigation }) => {
  const route = useRoute();
  const user = useSelector(selectUser);

  const { friendID, friendName, friendAvatar } = route.params;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    console.log("route.params", route.params);
    console.log("friendID ", friendID);
    API.post("message/getAllMessages", {
      friendID,
    })
      .then((response) => {
        setAllMessages(response.data.messages);
      })
      .catch((error) => {
        Toast.show("try again", {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      });
  }, []);
  const sendMessage = () => {
    if (message.length === 0) return;
    API.post("message/send", {
      toUserID: friendID,
      messageBody: message,
    })
      .then((response) => {
        setAllMessages([...allMessages, response.data.message]);
        Toast.show("message sent", {
          duration: 5000,
          type: "success",
          placement: "bottom",
        });
        setMessage("");
      })
      .catch((error) => {
        Toast.show(error.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      });
  };
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
        data={allMessages}
        keyExtractor={(item, index) => index.toString()}
        style={{
          width: "90%",
          height: "80%",
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 10,
          marginBottom: 90,
        }}
        renderItem={({ item, index }) => {
          const nowDate = new Date();
          const minutes = -differenceInMinutes(item.createdAt, nowDate);
          const getTime = timeAgo(minutes);
          return (
            <>
              {index === 0 && (
                <View
                  style={{
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      padding: 15,
                      margin: 30,
                      borderWidth: 3,
                      borderColor: "#4388CC",
                      color: "#4388CC",
                      fontWeight: "700",
                      fontSize: 20,
                      textAlign: "center",
                    }}
                  >
                    {friendName}
                  </Text>
                  {/* 
                  <Image
                    source={{ uri: IMG_URL + friendAvatar }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "grey",
                      marginBottom: 10,
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    {friendName}
                  </Text> */}
                </View>
              )}

              <View
                key={index}
                style={{
                  padding: 10,
                  // borderRadius: 10,
                  backgroundColor: "white",
                  // item.fromUserID !== user.id ? "grey" : "#4388CC",
                  // alignSelf:
                  //   item.fromUserID === user.id ? "flex-end" : "flex-start",
                  //from left to right
                  display: "flex",
                  marginBottom: 10,
                  borderColor:
                    item.fromUserID !== user.id ? "#F31B1B" : "#4388CC",
                  borderWidth: 3,
                  width: "100%",
                  display: "flex",
                  minHeight: 105,
                  flexDirection: item.fromUserID !== user.id ? "row" : "row-reverse",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: IMG_URL + friendAvatar }}
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
                    {getTime}
                  </Text>
                </View>

                <Text
                  style={{
                    color: item.fromUserID !== user.id ? "#F31B1B" : "#4388CC",
                    fontWeight: 700,
                    flex: 1,
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.message}
                </Text>
              </View>
            </>
          );
        }}
      />

      {/* //   <View
    //     style={{
    //       width: "90%",
    //       height: "80%",
    //       backgroundColor: "#fff",
    //       borderRadius: 10,
    //       padding: 10,
    //     }}
    //   >

    //     {allMessages.map((message, index) => {
    //       return (
    //         <View
    //           key={index}
    //           style={{
    //             padding: 10,
    //             borderRadius: 10,
    //             backgroundColor:
    //               message.fromUserID !== user.id ? "grey" : "#4388CC",
    //             alignSelf:
    //               message.fromUserID === user.id ? "flex-end" : "flex-start",
    //             marginBottom: 10,
    //           }}
    //         >
    //           <Text style={{ color: "#fff" }}>{message.message}</Text>
    //         </View>
    //       );
    //     })}
    //   </View> */}

      <Text>{allMessages.length === 0 && "No messages yet"}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "90%",
          borderRadius: 10,
          padding: 10,
          backgroundColor: "#4388CC",
          //bottom
          position: "absolute",
          bottom: 20,
        }}
      >
        <TextInput
          style={{
            width: "80%",
            height: 40,
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
          value={message}
          onChangeText={setMessage}
          placeholder="type here"
        />
        <TouchableOpacity onPress={sendMessage}>
          <MaterialCommunityIcons
            name="send"
            size={24}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

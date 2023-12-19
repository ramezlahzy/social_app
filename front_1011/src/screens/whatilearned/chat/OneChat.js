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
        console.log("response.data.messages", response.data.messages);
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
      }}
    >
      {/* <View style={{flexDirection:'row',justifyContent:'space-between',width:'90%'}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#4388CC"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Profile',{friendID})}>
        <MaterialCommunityIcons

            name="account-circle"
            size={24}
            color="#4388CC"
            />
        </TouchableOpacity>
        </View> */}

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
          return (
            <>
            {index === 0 && (
                <View
                    style={{
                        alignSelf: "center",
                    }}
                >
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
                  </Text>
                </View>
              )}
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 12,
                  color: "grey",
                  marginBottom: 10,
                }}
              >
                    {item.createdAt}
              </Text>
            <View
              key={index}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor:
                  item.fromUserID !== user.id ? "grey" : "#4388CC",
                alignSelf:
                  item.fromUserID === user.id ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff" }}>{item.message}</Text>
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

<Text>
    {
        allMessages.length === 0 && 'No messages yet'
    }
</Text>
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

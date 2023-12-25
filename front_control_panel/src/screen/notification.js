import React from "react";
import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import API from "../redux/API";
import { API_BASE, IMG_URL } from "../config";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
//import dialog
import Dialog from "react-native-dialog";
//useToast
import { Toast } from "react-native-toast-notifications";
const Notification = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const refresh = () => {
    setRefreshing(true);
    API.get(API_BASE + "admin/allUsers").then((res) => {
      setAllUsers(res.data);
      console.log(res.data);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const sendNotification = () => {
    API.post(API_BASE + "admin/sendNotification", {
      expoPushTokens: selected,
      title,
      body,
    })
      .then((res) => {
        Toast.show("Notification Sent Successfully");
        setTitle("");
        setBody("");
        setSelected([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (selectAll) {
            setSelected([]);
            setSelectAll(false);
          } else {
            setSelected(allUsers.map((i) => i.expoPushToken));
            setSelectAll(true);
          }
        }}
        style={{
          backgroundColor: selectAll ? "#eee" : "#fff",
          padding: 10,
          margin: 10,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          alignSelf: "flex-end",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {selectAll ? "Unselect All" : "Select All"}
        </Text>
      </TouchableOpacity>

      <FlatList
        style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}
        data={allUsers}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                margin: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                backgroundColor: selected.includes(item.expoPushToken)
                  ? "#eee"
                  : "#fff",
                borderRadius: 10,
                padding: 20,
                margin: 30,
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 20,
              }}
              onPress={() => {
                if (selected.includes(item.expoPushToken)) {
                  setSelected(selected.filter((i) => i !== item.expoPushToken));
                } else {
                  setSelected([...selected, item.expoPushToken]);
                }
              }}
            >
              <Image
                source={{ uri: IMG_URL + item.avatar }}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 50,
                  marginRight: 10,
                }}
              />
              <View
                style={{
                  flex: 3,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={{ fontSize: 10, color: "grey" }}>
                  {item.phoneNumber}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        onPress={() => {
          if (selected.length > 0) {
            setDialogVisible(true);
            // API.post(API_BASE + "admin/sendNotification", {
            //   expoPushTokens: selected,
            // }).then((res) => {
            //   Toast.show("Notification Sent Successfully");
            // });
          } else {
            Toast.show("Please select users first");
          }
        }}
        style={{
          backgroundColor: "black",
          padding: 10,
          margin: 10,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          alignSelf: "flex-end",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
          Send Notification
        </Text>
      </TouchableOpacity>

      <Dialog.Container visible={dialogVisible}>
        <View
          style={{
            flexDirection: "column",
            backgroundColor: "#fff",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Send Notification
          </Text>
          <Text style={{ fontSize: 10, color: "grey" }}>
            Write your message here
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: "black",
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Title
          </Text>
          <TextInput
            style={{
              backgroundColor: "#eee",
              padding: 10,
              margin: 10,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              width: "100%",
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              alignSelf: "center",
            }}
            onChangeText={(text) => setTitle(text)}
            value={title}
          />

          <Text
            style={{
              fontSize: 15,
              color: "black",
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Body
          </Text>
          <TextInput
            style={{
              backgroundColor: "#eee",
              padding: 10,
              margin: 10,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              width: "100%",
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              alignSelf: "center",
            }}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setBody(text)}
            value={body}
          />
        </View>

        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Send" onPress={() => {setDialogVisible(false);sendNotification()}} />
      </Dialog.Container>
    </View>
  );
};
export default Notification;

import React from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";
import API from "../redux/API";
import { API_BASE, IMG_URL } from "../config";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
//useToast
import { Toast } from "react-native-toast-notifications";
const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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

  return (
    <FlatList
      style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}
      data={allUsers}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
      renderItem={({ item }) => {
        return (
          <View
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
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              margin: 30,
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 20,
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
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 40,
                backgroundColor: item.blocked ? "red" : "green",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                // shadowColor:
              }}
              onPress={() => {
                setRefreshing(true);
                API.post(API_BASE + "admin/blockUser", {
                  userId: item.id,
                })
                  .then((res) => {
                    refresh();
                  })
                  .catch((err) => {
                    console.log(err);
                    Toast.show("Error", {
                      type: "danger",
                    });
                  });
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize:10
                }}
              >
                {item.blocked ? "Unblock" : "Block"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};
export default Users;

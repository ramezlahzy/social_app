import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import CustomFriendView from "../../../components/CustomFriendView";
import API from "../../../redux/API";
import { API_BASE } from "../../../config";
import { selectUser } from "../../../redux/selectors";

export default () => {
  const user = useSelector(selectUser);
  const renderItem = ({ item }) => {
    return (
      <CustomFriendView
        data={item}
        key={"friendview" + item.id}
      ></CustomFriendView>
    );
  };
  const [page, setPage] = useState(1);
  const [friendsList, setFriendList] = useState([]);
  useEffect(() => {
    API.get(API_BASE + `user/findAllUsersByDistance?page=${page}`)
      .then((res) => {
        let tempList = res.data.users.map((item) => {
          return {
            id: item.id,
            isFollowed: (user.friend ?? []).includes("" + item.id),
            AvatarImg: item.avatar,
            name: item.fullName,
            distance: item.distance,
          };
        });
        setFriendList(tempList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);
  const fetchMoreData = async (page) => {
    try {
      const res = await API.get(
        API_BASE + `user/findAllUsersByDistance?page=${page}`
      );
      let tempList = res.data.users.map((item) => {
        return {
          id: item.id,
          isFollowed: (user.friend ?? []).includes("" + item.id),
          AvatarImg: item.avatar,
          name: item.fullName,
          distance: item.distance,
        };
      });
      console.log(tempList);
      return tempList;
    } catch (error) {
      console.log(error);
    }
  };
  const loadMoreData = async () => {
    const newData = await fetchMoreData(page + 1);

    if (newData.length > 0) {
      setFriendList([...friendsList, ...newData]);
      setPage(page + 1);
    }
  };

  return (

    <View style={styles.container}>
      <FlatList
        data={friendsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMoreData}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 0,
    // fontFamily: 'ArialBold'
  },
  input: {
    fontFamily: "ArialBold",
    borderWidth: 2,
    paddingHorizontal: 8,
    fontweight: "bold",
    lineHeight: 18.4,
    borderColor: "#4388CC",
    color: "#4388CC",
    width: "90%",
    fontFamily: "ArialBold",
    fontSize: 16,
    height: 26,
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
});

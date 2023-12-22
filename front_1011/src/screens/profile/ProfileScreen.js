import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import CustomWhatIlearned from "../../components/CustomWhatIlearned.js";
import CustomFriendView from "../../components/CustomFriendView";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors";
import { setUser } from "../../redux/actions/user.action";
import { IMG_URL, API_BASE } from "../../config";
import API from "../../redux/API";
import { useToast } from "react-native-toast-notifications";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { RefreshControl } from "react-native";

export default ({ route }) => {
    const navigate = useNavigation();
  const friend = route.params;
  console.log("friend", friend);
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(selectUser);
  const [friendsList, setFriendList] = useState([]);
  const [location, setLocation] = useState();
  const [followerCnt, setFollowCnt] = useState(null);
  const [followingCnt, setFollowingCnt] = useState(null);
  const [change, setChange] = useState(false);
  const [whatilearnedList, setWhatIlearnedList] = useState([]);

  const [selectedImage, setSelectedImage] = useState(IMG_URL + user.avatar);
  const [isFollowed, setIsFollowed] = React.useState(false);

  const refresh = () => {
    API.get(API_BASE + "user/getFriendOfOther?userID=" + friend.friendID)
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
        console.log("err1", err);
      });
    API.get(API_BASE + "user/getWhatIlearnedOfOther?userID=" + friend.friendID)
      .then((res) => {
        let tempList = res.data.entries.map((item) => {
          return {
            id: item.id,
            name: item.fullName,
            text: item.content,
            daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000 * 60)),
            isFavorite: (user.favoriteWIL ?? []).includes("" + item.id),
            author: item.author,
          };
        });
        setWhatIlearnedList(tempList);
      })
      .catch((err) => {
        console.log("err2", err);
        toast.show("   try later    ", {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      });

    API.get(API_BASE + "user/getMyFollowingAndFollowerCnt")
      .then((res) => {
        console.log("res.data", res.data);
        setFollowCnt(res.data.followerCnt);
        setFollowingCnt(res.data.follwingCnt);
      })
      .catch((err) => {
        console.log("err5", err);
      });

    API.get("user/checkUserFollow", { params: { userID: friend.id } })
      .then((response) => {
        console.log("response.data.iswed", response.data.isFollowed);
        if (response.data.isFollowed) {
          setIsFollowed(true);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("error.response", error.response);
      });
  };
  useEffect(() => {
    refresh();
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    refresh();
  }, []);

  return (
    <ScrollView style={styles.container} scrollEventThrottle={16}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: 6,
            paddingVertical: 15,
          }}
        >
          <Image
            source={selectedImage ? { uri: selectedImage } : null}
            style={{
              borderWidth: 3,
              borderColor: "#4388CC",
              borderRadius: 40,
              width: 80,
              height: 80,
            }}
          ></Image>

          <Ionicons
            name="chatbubbles"
            size={24}
            color="rgba(67, 136, 204, 0.5)"
            onPress={() => {
              navigate.navigate("whatilearned", {
                screen: "chat",
                params: {
                  screen: "OneChat",
                  params: {
                    friendAvatar: friend?.friendAvatar,
                    friendID: friend?.friendID,
                    friendName: friend?.friendName,
                    isFollowed: friend?.isFollowed,
                  },
                },
              });
            }}
            style={{
              marginTop: 20,
              alignSelf: "flex-end",
              position: "absolute",
              right: -90,
              bottom: 0,
            }}
          />
        </View>
      </View>
      <Text
        style={{
          color: "#4388CC",
          fontSize: 16,
          lineHeight: 18.4,
          fontWeight: "700",
          width: "100%",
          textAlign: "center",
        }}
      >
        {friend?.friendName}
      </Text>
      <Text
        style={{
          color: "#4388CC",
          fontSize: 16,
          lineHeight: 18.4,
          fontWeight: "700",
          width: "100%",
          textAlign: "center",
          marginVertical: 8,
        }}
      >
        {followingCnt < 1000
          ? followingCnt
          : followingCnt < 1000000
          ? followingCnt / 1000 + "k"
          : followingCnt / 1000000 + "m"}{" "}
        Following,{" "}
        {followerCnt < 1000
          ? followerCnt
          : followerCnt < 1000000
          ? followerCnt / 1000 + "k"
          : followerCnt / 1000000 + "m"}{" "}
        Follower
      </Text>
      <Text
        style={{
          color: "#2E8B57",
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 8,
          width: "100%",
          textAlign: "center",
        }}
      >
        {friend?.distance} mile from you
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingBottom: 20,
          borderBottomColor: "#4388CC",
          borderBottomWidth: 2,
        }}
      >
        <TouchableOpacity
          disabled={friend?.isFollowed}
          onPress={() => followAPI()}
        >
          <Text
            style={{
              color: "#4388CC",
              fontSize: 16,
              lineHeight: 18.4,
              fontWeight: "700",
              borderBottomColor: "#4388CC",
              borderBottomWidth: friend?.isFollowed ? 2 : 0,
            }}
          >
            {friend?.isFollowed ? "Followed" : "Follow"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!friend?.isFollowed}
          onPress={() => followAPI()}
        >
          <Text
            style={{
              color: "#F31B1B",
              fontSize: 16,
              lineHeight: 18.4,
              fontWeight: "700",
              borderBottomColor: "#4388CC",
              borderBottomWidth: !friend?.isFollowed ? 2 : 0,
            }}
          >
            {friend?.isFollowed ? "unfollow" : "unfollowed"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          color: "#4388CC",
          fontSize: 25,
          marginTop: 15,
          marginBottom: 50,
          fontWeight: "700",
          width: "100%",
          textAlign: "center",
        }}
      >
        Friends
      </Text>

      {friendsList.map((item) => (
        <CustomFriendView
          data={item}
          key={"friendview" + item.id}
        ></CustomFriendView>
      ))}

      <Text
        style={{
          color: "#4388CC",
          fontSize: 25,
          fontWeight: "700",
          marginTop: 15,
          width: "100%",
          textAlign: "center",
        }}
      >
        {friend ? "" : "my"} what i learned
      </Text>

      {whatilearnedList.map((item) => (
        <CustomWhatIlearned
          data={item}
          setChange={setChange}
          key={"mywhatilearned" + item.id}
          flag={false}
          me={true}
        ></CustomWhatIlearned>
      ))}

      {/* {friend && (
        <TouchableOpacity onPress={() => loadMoreData2()}>
          <Text
            style={{
              color: "#4388CC",
              fontSize: 25,
              marginTop: 15,
              marginBottom: 50,
              fontWeight: "700",
              width: "100%",
              textAlign: "center",
            }}
          >
            More...
          </Text>
        </TouchableOpacity>
      )} */}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 32,
  },
  input: {
    fontFamily: "ArialBold",
    borderWidth: 2,
    paddingHorizontal: 8,
    fontWeight: "700",
    lineHeight: 18.4,
    borderColor: "#4388CC",
    color: "#4388CC",
    width: "90%",
    fontSize: 16,
    height: 26,
  },
  flatList: {
    width: "100%",
    flex: 1,
  },
});

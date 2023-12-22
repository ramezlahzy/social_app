//part 1

import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import SearchImg from "../../../../assets/image/search.png";
import { useNavigation } from "@react-navigation/native";
import CustomWhatIlearned from "../../../components/CustomWhatIlearned.js";
import CustomFriendView from "../../../components/CustomFriendView";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/selectors";
import { setUser } from "../../../redux/actions/user.action";
import { IMG_URL, API_BASE } from "../../../config";
import API from "../../../redux/API";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import InfiniteScroll from "react-infinite-scroll-component";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";


export default ({ friend }) => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const toast = useToast();
  const user = useSelector(selectUser);

  const [whatilearnedList, setWhatIlearnedList] = useState([]);

  const renderFriend = ({ item }) => {
    return (
      <CustomFriendView
        data={item}
        key={"friendview" + item.id}
      ></CustomFriendView>
    );
  };
  const renderWhatIlearned = ({ item }) => {
    return (
      <CustomWhatIlearned
        data={item}
        setChange={setChange}
        key={"mywhatilearned" + item.id}
        flag={friend ? true : false}
      ></CustomWhatIlearned>
    );
  };

  const [friendsList, setFriendList] = useState([]);
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [name, setName] = useState("");
  const [tempname, setTempName] = useState("");
  const [followerCnt, setFollowCnt] = useState(null);
  const [followingCnt, setFollowingCnt] = useState(null);
  const [change, setChange] = useState(false);

  const getCityAndCountry = async (latitude, longitude) => {
    let locationData = await Location.reverseGeocodeAsync({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    if (locationData.length > 0) {
      let city = locationData[0].city;
      let country = locationData[0].country;
      setCity(city);
      setCountry(country);
      console.log("City:", city);
      console.log("Country:", country);

      // You can save the city and country in your component's state or use it as needed
    }
  };
  const handlePickLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    try {
      setLocation({ latitude: 1.35362, longitude: 103.84435 });
      getCityAndCountry(location.latitude, location.longitude);

      const response = await API.post("user/updateLocation", {
        latitude: 1.35362,
        longitude: 103.84435,
      });
      toast.show(response.data.message, {
        duration: 5000,
        type: "success",
        placement: "bottom",
      });
    } catch (error) {
      toast.show("   try later    ", {
        duration: 5000,
        type: "danger",
        placement: "bottom",
      });
      console.log(error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      API.get(
        API_BASE +
          `user/${
            friend
              ? "getFriendOfOther?userID=" + friend.friendID + "&"
              : "getMyFriend?"
          }pageSize=${4}`
      )
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
          console.log("friends", tempList);
          setFriendList(tempList);
        })
        .catch((err) => {
          console.log("err1", err);
        });
      if (user) setSelectedImage(IMG_URL + user.avatar);
      setPage1(1);
      setPage2(1);
    }, [user])
  );
  const [page1, setPage1] = useState(1);
  const fetchMoreData1 = async (page) => {
    try {
      const res = await API.get(
        API_BASE +
          `user/${
            friend
              ? "getFriendOfOther?userID=" + friend.friendID + "&"
              : "getMyFriend?"
          }page=${page}&pageSize=${4}`
      );
      let tempList = res.data.users.map((item) => {
        return {
          id: item.id,
          isFollowed: true,
          AvatarImg: item.avatar,
          name: item.fullName,
          distance: item.distance,
        };
      });
      console.log("friendsfetchmoredata1", tempList);
      return tempList;
    } catch (error) {
      console.log("error3", error);
    }
  };
  const loadMoreData1 = async () => {
    // Simulate an API call or data fetch
    const newData = (await fetchMoreData1(page1 + 1)) ?? [];

    if (newData.length > 0) {
      setFriendList([...friendsList, ...newData]);
      setPage1(page1 + 1);
    }
  };
  const route = useRoute();
  const tabName = route.name;
  const whatilearnedID = route.params;
  const [whatIlearned, setWhatIlearned] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      if (whatilearnedID?.id) {
        API.get(
          API_BASE + `whatIlearned/getone?whatIlearnedID=${whatilearnedID.id}`
        ).then((res) => {
          let tempwhatIlearned = {
            id: res.data.data.id,
            name: res.data.data.fullName,
            text: res.data.data.content,
            agreeCnt: JSON.parse(res.data.data.agree ?? "[]"),
            disagreeCnt: JSON.parse(res.data.data.disagree ?? "[]"),
            commentCnt: JSON.parse(res.data.data.comment ?? "[]").length,
            daysAgo: ~~(
              (Date.now() - new Date(res.data.data.createdAt)) /
              (1000 * 60)
            ),
            isFavorite: (user.favoriteWIL ?? []).includes(
              "" + res.data.data.id
            ),
            author: res.data.data.author,
          };
          setWhatIlearned(tempwhatIlearned);
          console.log("whatIlearned", tempwhatIlearned);
        });
      } else setWhatIlearned(null);
    }, [whatilearnedID])
  );
  useFocusEffect(
    React.useCallback(() => {
      API.get(
        API_BASE +
          `user/${
            friend
              ? "getWhatIlearnedOfOther?userID=" + friend.friendID
              : "getMyWhatIlearned"
          }`
      )
        .then((res) => {
          let tempList = res.data.entries.map((item) => {
            return {
              id: item.id,
              name: item.fullName,
              text: item.content,
              // agreeCnt: JSON.parse(item.agree ?? "[]"),
              // disagreeCnt: JSON.parse(item.disagree ?? "[]"),
              // commentCnt: JSON.parse(item.comment ?? "[]").length,
              daysAgo: ~~(
                (Date.now() - new Date(item.createdAt)) /
                (1000 * 60)
              ),
              isFavorite: (user.favoriteWIL ?? []).includes("" + item.id),
              author: item.author,
            };
          });
          console.log("whatilearned list is =", tempList);
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
    }, [change, tabName])
  );
  const [page2, setPage2] = useState(1);
  //const [tempList,setTempList]=useState(null);
  const fetchMoreData2 = async (page) => {
    try {
      const res = await API.get(
        API_BASE +
          `user/${
            friend
              ? "getWhatIlearnedOfOther?userID=" + friend.friendID + "&"
              : "getMyWhatIlearned?"
          }page=${page}`
      );
      let tempList = res.data.entries.map((item) => {
        return {
          id: item.id,
          name: item.fullName,
          text: item.content,
          agreeCnt: JSON.parse(item.agree ?? "[]"),
          disagreeCnt: JSON.parse(item.disagree ?? "[]"),
          commentCnt: JSON.parse(item.comment ?? "[]").length,
          daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000 * 60)),
          isFavorite: (user.favoriteWIL ?? []).includes("" + item.id),
          author: item.author,
        };
      });
      console.log("whatilearnedfetchmoredata2", tempList);
      //setTempList(tempList);
      return tempList;
    } catch (error) {
      console.log("error4", error);
    }
  };

  const loadMoreData2 = async () => {
    // Simulate an API call or data fetch
    const newData = (await fetchMoreData2(page2 + 1)) ?? [];

    if (newData.length > 0) {
      setWhatIlearnedList([...whatilearnedList, ...newData]);

      setPage2(page2 + 1);
      console.log("whatilearnedList", whatilearnedList);
      console.log("page2", page2);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      API.get(API_BASE + "user/getMyFollowingAndFollowerCnt")
        .then((res) => {
          console.log("res.data", res.data);
          setFollowCnt(res.data.followerCnt);
          setFollowingCnt(res.data.follwingCnt);
        })
        .catch((err) => {
          console.log("err5", err);
        });
    }, [user])
  );
  useFocusEffect(
    React.useCallback(() => {
      if (friend) {
        console.log(friend.friendAvatar);
        setSelectedImage(IMG_URL + friend.friendAvatar);
      }
    }, [friend])
  );
  const [selectedImage, setSelectedImage] = useState(
    IMG_URL + (friend?.friendAvatar ? friend?.friendAvatar : user.avatar)
  );

  const pickImage = async () => {
    if (selectedImage === IMG_URL + user.avatar) {
      const result = await ImagePicker.launchCameraAsync({
        // const result = await ImagePicker.launchImageLibraryAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.Images,

        allowsEditing: true,
        aspect: [1, 1], // Set the aspect ratio to 1:1 for a square image
        quality: 1, // Image quality (0 to 1)
      });

      if (!result.canceled) {
        // Handle the selected image (e.g., display it or upload it)
        setSelectedImage(result.assets[0].uri);
        // You can set the selected image in state or upload it to a server here
      }
    } else {
      const formData = new FormData();
      formData.append("avatar", {
        uri: selectedImage,
        name: "avatar.jpg",
        type: "image/jpeg",
      });
      try {
        const response = await API.post("user/updateAvatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("response.data.user", response.data.user);
        dispatch(setUser(response.data.user));
        setSelectedImage(IMG_URL + response.data.user.avatar);
        toast.show(response.data.message, {
          duration: 5000,
          type: "success",
          placement: "bottom",
        });
      } catch (error) {
        console.log("error", error);
        if (error?.response?.data?.message) {
          toast.show(error.response.data.message, {
            duration: 5000,
            type: "danger",
            placement: "bottom",
          });
        }
      }
    }
  };

  //part 2
  const followAPI = async () => {
    try {
      const response = await API.post("user/followUser", {
        followUserID: "" + author,
      });
      dispatch(setUser(response.data.user));
      toast.show(response.data.message, {
        duration: 5000,
        type: "success",
        placement: "bottom",
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
      console.log("error2", error);
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    //const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height;
    const isEndReached =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    console.log(
      "event.nativeEvent",
      layoutMeasurement,
      contentOffset,
      contentSize
    );
    console.log("end", isEndReached);
    if (isEndReached) {
      loadMoreData2();
    }
  };

  return whatIlearned ? (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <Text
        style={{
          color: "#4388CC",
          fontSize: 25,
          marginTop: 22,
          marginBottom: 15,
          fontWeight: "700",
          width: "100%",
          textAlign: "center",
        }}
      >
        my what i learned
      </Text>
      <CustomWhatIlearned
        data={whatIlearned}
        setChange={setChange}
        key={"mywhatilearned" + whatIlearned.id}
        flag={friend ? true : false}
      ></CustomWhatIlearned>
    </ScrollView>
  ) : (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width:"20%",
          }}
        >
          <AntDesign name="checkcircle" size={24} color="green" />
          <Text
            style={{
              color: "#4388CC",
              fontSize: 15,
              margin: 10,
              fontWeight: "700",
              fontFamily: "ArialBold",
              textAlign: "center",
            }}
          >
            {city}, {country}
            {"\n"}
            latitude: {location?.latitude} {"  "}
            longitude: {location?.longitude}
          </Text>
        </View> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* {!friend ? (
          <TouchableOpacity>
            <Text
              style={{
                color: "#2E8B57",
                fontSize: 16,
                lineHeight: 18.4,
                fontWeight: "700",
                opacity: 0,
              }}
            >
              {selectedImage === IMG_URL + user.avatar
                ? "CHANGE PHOTO"
                : "UPLOAD"}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )} */}
        {!friend ? (
          <TouchableOpacity onPress={() => handlePickLocation()}>
            <Text
              style={{
                color: "#2E8B57",
                fontSize: 16,
                lineHeight: 18.4,
                fontWeight: "700",
              }}
            >
              update Location
              {/* {selectedImage === IMG_URL + user.avatar
                ? "CHANGE PHOTO"
                : "UPLOAD"} */}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
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
          {
            friend&&
             <Ionicons name="chatbubbles" size={24} color='rgba(67, 136, 204, 0.5)'
             onPress={() => {
                 navigate.navigate("whatilearned", {
                     screen: "chat",
                     params: {
                     screen: "OneChat",
                     params: {
                         friendAvatar: friend?.friendAvatar,
                         friendID: friend?.friendID,
                         friendName: friend?.friendName,
                        //  distance: distance.toFixed(2),
                         isFollowed: friend?.isFollowed,
                     },
                     },
                 });
                 }
             }
             style={{marginTop: 20,
                 alignSelf: "flex-end",
                 position: "absolute",
                 right:-90,
                 bottom: 0,
             }}
             
             />
          }
        </View>
        {!friend ? (
          <TouchableOpacity onPress={() => pickImage()}>
            <Text
              style={{
                color: "#2E8B57",
                fontSize: 16,
                lineHeight: 18.4,
                fontWeight: "700",
              }}
            >
              {selectedImage === IMG_URL + user.avatar
                ? "CHANGE PHOTO"
                : "UPLOAD"}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
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
        {friend?.friendName ?? "ME"}
      </Text>
      {friend ? (
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
      ) : (
        <></>
      )}
      {friend ? (
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
      ) : (
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
          {followingCnt < 1000
            ? followingCnt
            : followingCnt < 1000000
            ? followingCnt / 1000 + "k"
            : followingCnt / 1000000 + "m"}
          {" "} Following,{" "}
          {followerCnt < 1000
            ? followerCnt
            : followerCnt < 1000000
            ? followerCnt / 1000 + "k"
            : followerCnt / 1000000 + "m"}{" "}
          Follower
        </Text>
      )}

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

      {friendsList.map((item) => renderFriend({ item }))}
      {/* <TouchableOpacity onPress={() => loadMoreData1()}>
        <View
          style={{
            borderBottomColor: "#4388CC",
            borderBottomWidth: 2,
          }}
        >
          <Text
            style={{
              color: "#4388CC",
              fontSize: 25,
              marginTop: 15,
              marginBottom: 100,
              fontWeight: "700",
              width: "100%",
              textAlign: "center",
            }}
          >
            More...
          </Text>
        </View>
      </TouchableOpacity> */}

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

      {whatilearnedList.map((item) => renderWhatIlearned({ item }))}

      {
      friend&&
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
      }
      {/* <FlatList
            data={friendsList}
            renderItem={renderFriend}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreData1}
            style={styles.flatList}
        /> */}
      {/* <Text style={{
            color: "#4388CC",
            fontSize: 25,
            marginTop: 22,
            marginBottom: 15,
            fontWeight: '700',
            width: '100%',
            textAlign: 'center'
        }}>my what i learned</Text>
        <FlatList
            data={whatilearnedList}
            renderItem={renderWhatIlearned}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreData2}
            style={styles.flatList}
           // scrollEnabled={false}
        />   */}
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

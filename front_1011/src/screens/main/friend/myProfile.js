import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomWhatIlearned from "../../../components/CustomWhatIlearned.js";
import CustomFriendView from "../../../components/CustomFriendView";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/selectors";
import { IMG_URL, API_BASE } from "../../../config";
import API from "../../../redux/API";
import { useToast } from "react-native-toast-notifications";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { RefreshControl } from "react-native";
import { setUser } from "../../../redux/actions/user.action";

const MyProfile = () => {
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
  const getCityAndCountry = async (latitude, longitude) => {
    console.log("latitude", latitude);
    console.log("longitude", longitude);
    let locationData = await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    });
    console.log("locationData", locationData);
    if (locationData.length > 0) {
      let city = locationData[0].city;
      let country = locationData[0].country;
      return { city, country };
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
      let location = await Location.getCurrentPositionAsync({});
      console.log("location", location);
      setLocation(location);
      const cityCountry = getCityAndCountry(
        location.coords.latitude,
        location.coords.longitude
      );

      const response = await API.post("user/updateLocation", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      toast.show(
        response.data.message +
          ` new location city: ${cityCountry.region}  country:${cityCountry.country}`,
        {
          duration: 5000,
          type: "success",
          placement: "bottom",
        }
      );
    } catch (error) {
      toast.show(error.message, {
        duration: 5000,
        type: "danger",
        placement: "bottom",
      });
      console.log(error);
    }
  };
  const pickImage = async () => {
    if (selectedImage === IMG_URL + user.avatar) {
      const result = await ImagePicker.launchCameraAsync({
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
        setUser(response.data.user);
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
  const refresh = () => {
    API.get(API_BASE + `user/${"getMyFriend?"}`)
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
    API.get(API_BASE + `user/getMyWhatIlearned`)
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

    API.get(API_BASE + "user/getMyFollowingAndFollowerCnt")
      .then((res) => {
        console.log("res.data", res.data);
        setFollowCnt(res.data.followerCnt);
        setFollowingCnt(res.data.follwingCnt);
      })
      .catch((err) => {
        console.log("err5", err);
      });

    //   console.log("user avatar ",user.avatar)
    // if (user) setSelectedImage(IMG_URL + user.avatar);
  };
  useEffect(() => {
    refresh();
    console.log("here the user",user)
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    refresh();
    // setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => handlePickLocation()}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Text
            style={{
              color: "#2E8B57",
              fontSize: 16,
              lineHeight: 18.4,
              fontWeight: "700",
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            update Location
          </Text>
        </TouchableOpacity>
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
              //   borderColor: "#4388CC",
              borderRadius: 40,
              width: 80,
              height: 80,
              flex: 3,
            }}
          ></Image>
        </View>
        <TouchableOpacity
          onPress={() => pickImage()}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Text
            style={{
              color: "#2E8B57",
              fontSize: 16,
              lineHeight: 18.4,
              fontWeight: "700",
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            {selectedImage === IMG_URL + user.avatar
              ? "CHANGE PHOTO"
              : "UPLOAD"}
          </Text>
        </TouchableOpacity>
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
        {"ME"}
      </Text>

      {
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
            : followingCnt / 1000000 + "m"}{" "}
          Following,{" "}
          {followerCnt < 1000
            ? followerCnt
            : followerCnt < 1000000
            ? followerCnt / 1000 + "k"
            : followerCnt / 1000000 + "m"}{" "}
          Follower
        </Text>
      }

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
        what i learned
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

export default MyProfile;

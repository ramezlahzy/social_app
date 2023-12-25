import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import AgreeImage from "../../assets/image/agree.png";
import DisagreeImage from "../../assets/image/disagree.png";
import AgreeFullImage from "../../assets/image/agreefull.png";
import DisagreeFullImage from "../../assets/image/disagreefull.png";
import HeartImage from "../../assets/image/heart.png";
import HeartFullImage from "../../assets/image/heartfull.png";
import AvatarImg1 from "../../assets/image/Avatar3.png";
import AvatarImg2 from "../../assets/image/Avatar4.png";
import { useState } from "react";
import API from "../redux/API";
import { useToast } from "react-native-toast-notifications";
import { IMG_URL } from "../config";
import { setUser } from "../redux/actions/user.action";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/selectors";
import { useNavigation } from "@react-navigation/native";
import Hyperlink from "react-native-hyperlink";
import { FlatList } from "react-native-gesture-handler";
export default ({ data, setChange, flag = true, me }) => {
  const {
    isFollowed,
    AvatarImg,
    name,
    text,
    agreeCnt,
    disagreeCnt,
    commentCnt,
    isFavorite,
    daysAgo,
    id,
    author,
    reports,
  } = data;
  const toast = useToast();
  const user = useSelector(selectUser);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigation();
  const [commentList, setCommentList] = useState([]);
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [txt, setTxt] = useState(text);
  const [authorData, setAuthorData] = useState();
  const [isFollowedFull, setIsFollowedFull] = useState(isFollowed);
  const [authorAvatar, setAuthorAvatar] = useState("");

  console.log("reports is ", reports);
  const fetchUserAvatar = async () => {
    try {
      const response = await API.get(`user/getUserInfo?id=${author}`);
      setAuthorAvatar(response.data.user.avatar);
      setAuthorData(response.data.user);
      // console.log("authorAvatar", response.data.user.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  const deleteAPI = async () => {
    try {
      console.log(id);
      const response = await API.delete(
        `whatIlearned/deleteWhatIlearned/${id}`
      );
      setChange((change) => !change);
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
      console.log(error);
    }
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

  const findURLsInText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regular expression to find URLs
    const matches = text.match(urlRegex);
    return matches || [];
  };

  const renderTextWithLinks = (text) => {
    const urls = findURLsInText(text);

    if (urls.length === 0) {
      return (
        <Text
          style={{
            paddingVertical: 19,
            paddingHorizontal: 10,
            color: "#4388CC",
            fontFamily: "ArialBold",
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {text}
        </Text>
      );
    }

    const parts = [];
    let lastIndex = 0;

    urls.forEach((url, index) => {
      const startIndex = text.indexOf(url, lastIndex);
      const endIndex = startIndex + url.length;

      parts.push(
        <Text key={index}>{text.substring(lastIndex, startIndex)}</Text>
      );
      parts.push(
        <Text
          key={index + 1}
          style={{ color: "blue", textDecorationLine: "underline" }}
          onPress={() => Linking.openURL(url)}
        >
          {url}
        </Text>
      );

      lastIndex = endIndex;
    });

    if (lastIndex < text.length) {
      parts.push(<Text key={lastIndex}>{text.substring(lastIndex)}</Text>);
    }

    return (
      <Text
        style={{
          paddingVertical: 19,
          paddingHorizontal: 10,
          borderColor: "#4388CC",
          borderBottomWidth: 2,
          color: "#4388CC",
          fontFamily: "ArialBold",
          fontSize: 16,
          fontWeight: "700",
        }}
      >
        {parts}
      </Text>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        paddingHorizontal: 52,
        paddingVertical: 32,
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          marginTop: 20,
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: IMG_URL + authorAvatar }}
            style={{
              borderWidth: me ? 0 : 3,
              borderRadius: 40,
              width: 50,
              height: 50,
              backgroundColor: "black",
            }}
          ></Image>
        </View>
      </View>
      <Text
        style={{
          color: "#4388CC",
          fontSize: 16,
          lineHeight: 18.4,
          fontWeight: "700",
          fontFamily: "ArialBold",
          marginTop: 10,
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {authorData?.fullName}
      </Text>
      <Text
        style={{
          color: "#4388CC",
          fontSize: 14,
          lineHeight: 16.1,
          fontWeight: "700",
          fontFamily: "ArialBold",
          marginTop: 11,
        }}
      >
        {timeAgo(daysAgo)}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",

          width: "100%",
        }}
      >
        <KeyboardAvoidingView
          style={{
            marginTop: 7,
            width: "100%",
          }}
        >
          {renderTextWithLinks(txt)}
        </KeyboardAvoidingView>
      </View>

      {
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {reports && (
            <Text
              style={{
                color: "#4388CC",
                fontSize: 14,
                lineHeight: 16.1,
                fontWeight: "700",
                fontFamily: "ArialBold",
                marginRight: 10,
              }}
            >
              Reports: {" " + reports + " "}
            </Text>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: "red",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              alignSelf: "center",
            }}
            onPress={deleteAPI}
          >
            <Text
              style={{
                color: "white",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      }

      <View
        style={{
          backgroundColor: "black",
          height: 1,
          minWidth: "90%",
          alignSelf: "center",
          margin: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {
    height: "100%",
    width: "100%",
  },
  textNormal1: {
    fontSize: 16,
    lineHeight: 18.4,
    fontWeight: "700",
    fontFamily: "ArialBold",
    color: "#4388CC",
  },
  textNormal2: {
    fontSize: 16,
    lineHeight: 18.4,
    fontWeight: "700",
    fontFamily: "ArialBold",
    color: "#F31B1B",
  },
  textNormal3: {
    fontSize: 16,
    lineHeight: 18.4,
    fontWeight: "700",
    fontFamily: "ArialBold",
    color: "#2E8B57",
  },
  textSmall: {
    fontSize: 10,
    lineHeight: 11.5,
    fontWeight: "700",
    fontFamily: "ArialBold",
    color: "#F31B1B",
  },
});

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
  const [agreeList, setAgreeList] = useState(false);
  const [showAgreeList, setShowAgreeList] = useState(false);
  const [disagreeList, setDisAgreeList] = useState(false);
  const [showDisAgreeList, setShowDisAgreeList] = useState(false);
  const [disAgreeFull, setDisAgreeFull] = useState(false);
  const [agreeFull, setAgreeFull] = useState(false);
  const [authorData, setAuthorData] = useState();
  const [isFavoriteFull, setIsFavoriteFull] = useState(isFavorite);
  const [isFollowedFull, setIsFollowedFull] = useState(isFollowed);
  const [likesNumber, setLikesNumber] = useState(0);
  const [dislikesNumber, setDislikesNumber] = useState(0);
  const [authorAvatar, setAuthorAvatar] = useState("");

  const fetchUserAvatar = async () => {
    try {
      const response = await API.get(`user/getUserInfo?id=${author}`);
      setAuthorAvatar(response.data.user.avatar);
      // console.log("authorAvatar", response.data.user.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  const fetchLikesNumber = async () => {
    try {
      const response = await API.get(
        `whatIlearned/getAgreeUserList?whatIlearnedID=${JSON.stringify(id)}`
      );
      setLikesNumber(response.data.userList.length);
      if (response.data.userList.find((item) => item.userID === user.id)) {
        setAgreeFull(true);
      }
      // console.log("likesNumbers", response.data.userList.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDislikesNumber = async () => {
    try {
      const response = await API.get(
        `whatIlearned/getDisAgreeUserList?whatIlearnedID=${JSON.stringify(id)}`
      );
      setDislikesNumber(response.data.userList.length);
      if (response.data.userList.find((item) => item.userID === user.id)) {
        setDisAgreeFull(true);
      }
      //
      // console.log("dislikesNumber", response.data.userList.length);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLikesNumber();
    fetchDislikesNumber();
  }, [id]);

  useEffect(() => {
    //  API.get(`user/getUser/${author}`).then((res) => {
    //   setAuthorData(res.data.user);
    //   console.log("authorData", res.data.user);
    // }).catch((err) => {
    //   console.log("err");
    //   console.log(err);
    // });
    //path id as query param
    API.get(`user/getUserInfo?id=${author}`)
      .then((res) => {
        setAuthorData(res.data.user);
      })
      .catch((err) => {
        console.log("err");
        // console.log(err);
      });
  }, []);
  //this rerenders when data or commentCnt changes and data is
  // const {isFollowed , AvatarImg, name, text, agreeCnt, disagreeCnt, commentCnt, isFavorite , daysAgo, id, author} = data;
  useEffect(() => {
    getComment();
  }, [data.commentCnt]);

  const followAPI = async () => {
    try {
      const response = await API.post("user/followUser", {
        followUserID: "" + author,
      });
      // console.log("response.data.message=   ", response.data.message);
      dispatch(setUser(response.data.user));
      const message = response.data.message;
      // console.log(
      //   "response.data.message === Unfollowed successfully",
      //   message === "Unfollow successfully"
      // );
      if (message === "Unfollow successfully") {
        setIsFollowedFull(false);
      } else {
        setIsFollowedFull(true);
      }
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

  //this renders the comment
  const renderItem = (item, index) => {
    return (
      <View
        key={"comment" + item.id}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingTop: 10,
          // borderBottomWidth: 2,
          borderBottomColor: "#4388CC",
          backgroundColor: "#D4E8FD",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            margin: 10,
            gap: 10,
          }}
        >
          <Image
            source={{ uri: IMG_URL + item.image }}
            style={{
              borderWidth: 3,
              borderColor: isFollowedFull ? "#4388CC" : "#F31B1B",
              borderRadius: 17,
              width: 35,
              height: 35,
            }}
          ></Image>
          <Text style={styles.textNormal1}>{item.name}</Text>
        </View>

        <Text
          style={[
            styles.textNormal3,
            {
              flex: 1,
              textAlign: "left",
              marginLeft: 10,
            },
          ]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  //this is save alert when you press save
  const showSaveAlert = () => {
    setEdit(!isEdit);
    //this is if edit is true
    if (isEdit) {
      Alert.alert("Confirm", "Do you really want to save changes?", [
        {
          text: "Ok",
          onPress: () => {
            if (isEdit) saveAPI();
          },
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    }
  };

  //this is delete alert
  const showDeleteAlert = () => {
    Alert.alert("Confirm", "Do you really want to delete?", [
      {
        text: "Ok",
        onPress: () => {
          deleteAPI();
        },
        style: "default",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const saveAPI = async () => {
    try {
      const response = await API.post("whatIlearned/updateWhatIlearned", {
        whatIlearnedID: id,
        updateContent: txt,
      });
      setChange((change) => !change);
      toast.show(response.data.message, {
        duration: 2000,
        type: "success",
        placement: "bottom",
      });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
  };

  const agreeAPI = async () => {
    try {
      {
        const response = await API.post("whatIlearned/agreeWhatIlearned", {
          whatIlearnedID: "" + id,
        });
        toast.show(response.data.message, {
          duration: 2000,
          type: "success",
          placement: "bottom",
        });
        if (response.data.message === "Agreement removed successfully") {
          setAgreeFull(false);
        } else setAgreeFull(true);

        // setAgreeFull((change) => !change);
        setChange((change) => !change);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
    fetchLikesNumber();
    fetchDislikesNumber();
  };

  const disAgreeAPI = async () => {
    try {
      {
        const response = await API.post("whatIlearned/disagreeWhatIlearned", {
          whatIlearnedID: "" + id,
        });
        toast.show(response.data.message, {
          duration: 5000,
          type: "success",
          placement: "bottom",
        });
        if (response.data.message === "Disagreement removed successfully") {
          setDisAgreeFull(false);
        } else setDisAgreeFull(true);
        setChange((change) => !change);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
    fetchLikesNumber();
    fetchDislikesNumber();
  };

  const reportAPI = async () => {
    try {
      const response = await API.post("whatIlearned/reportWhatIlearned", {
        whatIlearnedID: "" + id,
      });
      toast.show(response.data.message, {
        duration: 5000,
        type: "success",
        placement: "bottom",
      });
      setChange((change) => !change);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
  };

  const addComment = async () => {
    try {
      if (newComment.length === 0) return;
      const response = await API.post("whatIlearned/addComment", {
        whatIlearnedID: "" + id,
        text: newComment,
      });
      toast.show(response.data.message, {
        duration: 2000,
        type: "success",
        placement: "bottom",
      });
      setChange((change) => !change);
      setNewComment("");
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
  };

  const getComment = async () => {
    try {
      const response = await API.get(
        `whatIlearned/getComment?whatIlearnedID=${id}`
      );
      // console.log("response.data.comments", response.data.comments);
      const tempCommentList = response.data.comments.map((comment) => {
        return {
          name: comment.User.fullName,
          image: comment.User.avatar,
          id: comment.id,
          text: comment.text,
          isFollowed: (user.friend ?? []).includes("" + comment.userID),
        };
      });
      setCommentList(tempCommentList);

      setChange((change) => !change);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
  };

  const favoriteAPI = async () => {
    try {
      const response = await API.post("user/setfavorite", {
        whatIlearnedID: "" + id,
      });

      if (response.data.message === "Set as unfavorite successfully") {
        setIsFavoriteFull(false);
      } else {
        setIsFavoriteFull(true);
      }

      dispatch(setUser(response.data.user));
      toast.show(response.data.message, {
        duration: 2000,
        type: "success",
        placement: "bottom",
      });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
  };
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
            // height:"100%",

            //maxHeight: 269,
            // overflow: 'hidden',
            paddingVertical: 19,
            paddingHorizontal: 10,
            borderColor: "#4388CC",
            borderBottomWidth: 2,
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
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!me && (
            <TouchableOpacity onPress={followAPI} disabled={isFollowedFull}>
              <Text
                style={{
                  color: "#4388CC",
                  fontSize: 16,
                  lineHeight: 18.4,
                  fontWeight: "700",
                  fontFamily: "ArialBold",
                  marginRight: 25,
                  opacity: isFollowedFull ? 0.5 : 1,
                }}
              >
                Follow
              </Text>
            </TouchableOpacity>
          )}
          <Image
            source={{ uri: IMG_URL + authorAvatar }}
            style={{
              borderWidth: me ? 0 : 3,
              borderColor:isFollowedFull ? "#4388CC" : "#F31B1B",
              borderRadius: 40,
              width: 50,
              height: 50,
              backgroundColor: "black",
            }}
          ></Image>
          {!me && (
            <TouchableOpacity onPress={followAPI} disabled={!isFollowedFull}>
              <Text
                style={{
                  color: "#F31B1B",
                  fontSize: 16,
                  lineHeight: 18.4,
                  fontWeight: "700",
                  fontFamily: "ArialBold",
                  marginLeft: 20,
                  opacity: !isFollowedFull ? 0.5 : 1,
                }}
              >
                UnFollow
              </Text>
            </TouchableOpacity>
          )}
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
        <View
          style={{
            marginTop: 13,
            height: "auto",
            // flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
            opacity: 0,
            // marginRight:10,
            // paddingRight:10
          }}
        >
          <TouchableOpacity>
            <Text style={styles.textNormal3}>edit</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.textNormal2}>delete</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{
            marginTop: 7,
            width: "100%",
            //maxHeight: 376,
            //overflow: 'hidden',

            // borderColor: "#4388CC",
            // borderWidth: 2,
          }}
        >
          {
            isEdit ? (
              <TextInput
                multiline={true}
                style={{
                  //maxHeight: 376,
                  paddingVertical: 19,
                  paddingHorizontal: 10,
                  borderColor: "#4388CC",
                  color: "#4388CC",
                  fontFamily: "ArialBold",
                  borderBottomWidth: 2,
                  textAlignVertical: "top",
                  textAlign: "center",
                }}
                value={txt}
                onChange={(e) => {
                  setTxt(e.nativeEvent.text);
                }}
              ></TextInput>
            ) : (
              renderTextWithLinks(txt)
            )
            // <Hyperlink linkDefault={true} linkStyle={{ color: 'blue', textDecorationLine: 'underline' }}  onPress={(url, text) => handleLinkPress(url)}>
            //     <Text style={{
            //         maxHeight: 269,
            //         overflow: 'hidden',
            //         paddingVertical: 19,
            //         paddingHorizontal: 10,
            //         borderColor:  "#4388CC",
            //         borderBottomWidth: 2,
            //         color: "#4388CC",
            //         fontFamily: 'ArialBold',
            //         fontSize: 16,
            //         fontWeight: '700'
            //     }}>{text}</Text>
            // </Hyperlink>
          }

          <View
            style={{
              flexDirection: "row",
              paddingTop: 15,
              // paddingHorizontal: 19,
              justifyContent: "space-between",
              borderColor: "#F31B1B",
              // borderBottomWidth: 2,
              paddingBottom: 5,
              alignItems: "center",
              gap: 3,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                agreeAPI();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                // flex: 1,
                height: 40,
                borderColor: "#4388CC",
                borderWidth: 1,
                borderRadius: 50,
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <View>
                {/* <Text style={styles.textNormal3}>AGREE</Text> */}

                <Text
                  style={[
                    styles.textNormal3,
                    {
                      position: "absolute",
                      top: -35,
                      right: -35,
                    },
                  ]}
                >
                  {likesNumber < 1000
                    ? likesNumber
                    : likesNumber < 1000000
                    ? likesNumber / 1000 + "k"
                    : likesNumber / 1000000 + "m"}
                </Text>
              </View>
              <Image
                source={agreeFull ? AgreeFullImage : AgreeImage}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
              ></Image>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                disAgreeAPI();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                // flex: 2,
                borderColor: "#4388CC",
                borderWidth: 1,
                height: 40,
                borderRadius: 50,
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <View>
                {/* <Text style={styles.textNormal2}>Disagree</Text> */}

                <Text
                  style={[
                    styles.textNormal2,
                    {
                      position: "absolute",
                      top: -35,
                      right: -35,
                    },
                  ]}
                >
                  {dislikesNumber < 1000
                    ? dislikesNumber
                    : dislikesNumber < 1000000
                    ? dislikesNumber / 1000 + "k"
                    : dislikesNumber / 1000000 + "m"}
                </Text>
              </View>
              <Image
                source={disAgreeFull ? DisagreeFullImage : DisagreeImage}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
              ></Image>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowComment(!showComment)}>
              <View
                style={{
                  // flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  borderColor: "#4388CC",
                  borderWidth: 1,
                  borderRadius: 50,
                  padding: 5,
                }}
              >
                <Text style={styles.textNormal1}>COMMENT</Text>
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -15, // Adjust the position as needed
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.textNormal1}>{commentCnt}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={false}
              onPress={() => {
                favoriteAPI();
              }}
              style={{
                // flex: 1,
                borderColor: "#4388CC",
                borderWidth: 1,
                borderRadius: 50,
                height: 40,
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={isFavoriteFull ? HeartFullImage : HeartImage}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Confirm", "Do you really want to report", [
                  {
                    text: "Ok",
                    onPress: () => {
                      reportAPI();
                    },
                    style: "default",
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ]);
              }}
              style={{
                // flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#4388CC",
                borderWidth: 1,
                borderRadius: 50,
                padding: 5,
                height: 40,
              }}
            >
              <Text style={styles.textSmall}>REPORT</Text>
            </TouchableOpacity>
          </View>
          {/* 
          <View
            style={{
              flexDirection: "row",
              paddingTop: 8,
              paddingHorizontal: 12,
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 5,
              height: 38,
            }}
          ></View> */}
        </KeyboardAvoidingView>
        <View
          style={{
            marginLeft: !flag ? 7 : 0,
            marginTop: 13,
            flexDirection: "column",
            justifyContent: "space-around",
            opacity: !flag ? 1 : 0,
          
          }}
        >
          <TouchableOpacity
            onPress={() => {
              showSaveAlert();
            }}
            style={{
              
            }}
          >
            <Text style={styles.textNormal3}>{!isEdit ? "edit" : "save"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showDeleteAlert();
            }}
          >
            <Text style={styles.textNormal2}>delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <ScrollView
          style={{
            maxHeight: 220,
            width: "40%",
            marginTop: 20,
            borderWidth: agreeList.length ? 2 : 0,
            borderColor: "#4388CC",
            opacity: showAgreeList ? 1 : 0,
            backgroundColor: "white", //"#ffcc33"
          }}
        >
          {showAgreeList &&
            agreeList.map((item) => {
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: 12,
                    borderBottomColor: "#FFF",
                    borderBottomWidth: 3,
                  }}
                >
                  <Image
                    source={{ uri: IMG_URL + item.avatar }}
                    style={{
                      borderWidth: 3,
                      borderColor: (user.friend ?? []).includes("" + item.id)
                        ? "#4388CC"
                        : "#F31B1B",
                      borderRadius: 12,
                      width: 25,
                      height: 25,
                    }}
                  ></Image>
                  <Text
                    style={{
                      color: (user.friend ?? []).includes("" + item.id)
                        ? "#4388CC"
                        : "#F31B1B",
                      fontFamily: "ArialBold",
                      fontWeight: "700",
                      fontSize: 10,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              );
            })}
        </ScrollView>
        {
          <ScrollView
            style={{
              maxHeight: 220,
              width: "40%",
              marginTop: 20,
              borderWidth: disagreeList.length ? 2 : 0,
              borderColor: "#4388CC",
              opacity: showDisAgreeList ? 1 : 0,
            }}
          >
            {showDisAgreeList &&
              disagreeList.map((item) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: 12,
                      borderBottomColor: "#FFF",
                      borderBottomWidth: 3,
                    }}
                  >
                    <Image
                      source={{ uri: IMG_URL + item.avatar }}
                      style={{
                        borderWidth: 3,
                        borderColor: (user.friend ?? []).includes("" + item.id)
                          ? "#4388CC"
                          : "#F31B1B",
                        borderRadius: 12,
                        width: 25,
                        height: 25,
                      }}
                    ></Image>
                    <Text
                      style={{
                        color: (user.friend ?? []).includes("" + item.id)
                          ? "#4388CC"
                          : "#F31B1B",
                        fontFamily: "ArialBold",
                        fontWeight: "700",
                        fontSize: 10,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                );
              })}
          </ScrollView>
        }
      </View>
      {showComment && (
        <View
          style={{
            // borderWidth: 2,
            // borderColor: "#4388CC",
            width: "100%",
            alignItems: "center",
            marginTop: 20,
            flex: 1,
          }}
        >
          <Text style={styles.textNormal1}>Comments</Text>
          <ScrollView style={{ maxHeight: 210, width: "100%" }}>
            {commentList.map((item, index) => renderItem(item, index))}
          </ScrollView>
          <View
            style={{
              width: "100%",
              height: 2,
              marginVertical: 10,
              backgroundColor: "#4388CC",
            }}
          />

          <View
            style={{
              width: "100%",
              paddingHorizontal: 32,
              marginBottom: 15,
              marginTop: 19,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              multiline={true}
              style={{
                height: 100,
                paddingTop: 8,
                paddingHorizontal: 15,
                width: "100%",
                borderWidth: 3,
                borderColor: "#F31B1B",
                textAlignVertical: "top",
                fontFamily: "ArialBold",
                color: "#4388CC",
                fontSize: 16,
                backgroundColor: "#FFCC33",
              }}
              value={newComment}
              onChange={(e) => {
                setNewComment(
                  e.nativeEvent.text.length > 280
                    ? newComment
                    : e.nativeEvent.text
                );
              }}
            ></TextInput>
            <TouchableOpacity
              onPress={() => addComment()}
              style={{
                width: 120,
                marginTop: 2,
                backgroundColor: "#FFCC33",
              }}
            >
              <Text
                style={{
                  fontFamily: "ArialBold",
                  color: "#4388CC",
                  fontSize: 25,
                  textAlign: "center",
                  textAlignVertical: "center",
                  borderWidth: 5,
                  borderColor: "#4388CC",
                }}
              >
                SEND
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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

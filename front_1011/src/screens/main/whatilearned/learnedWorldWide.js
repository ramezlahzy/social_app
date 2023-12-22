import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import CustomWhatIlearned from "../../../components/CustomWhatIlearned.js";
import API from "../../../redux/API";
import { API_BASE } from "../../../config";
import { selectUser } from "../../../redux/selectors";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import { useToast } from "react-native-toast-notifications";
export default ({ flag }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const tabName = route.name;
//   console.log(tabName, flag);
  const user = useSelector(selectUser);
  const toast = useToast();
  const [whatilearnedList, setWhatIlearnedList] = useState([]);

  const refresh = () => {
    let url = (url =
      API_BASE +
      "whatIlearned/get?shareWithWorldWide=true&shareWithFriend=false");

    API.get(url)
      .then((res) => {
        console.log("entry", res.data.entries, res.data.entries.length);
        let tempList = res.data.entries.map((item) => {
          return {
            id: item.id,
            isFollowed:
              (user.friend ?? []).includes("" + item.author) ||
              item.author === user.id,
            AvatarImg: item.User.avatar,
            name: item.authorName,
            text: item.content,
            agreeCnt: JSON.parse(item.agree ?? "[]"),
            disagreeCnt: JSON.parse(item.disagree ?? "[]"),
            commentCnt: JSON.parse(item.comment ?? "[]").length,
            daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000 * 60)),
            isFavorite: (user.favoriteWIL ?? []).includes("" + item.id),
            author: item.author,
          };
        });
        setWhatIlearnedList(tempList);
      })
      .catch((err) => {
        console.log(err);
        toast.show(err.response.data.message, {
          duration: 5000,
          type: "danger",
        });
      });
  };

  const [change, setChange] = useState(false);
  const renderWhatIlearned = ({ item }) => {
    return (
      <CustomWhatIlearned
        data={item}
        setChange={setChange}
        key={"mywhatilearned" + item.id}
        flag={true}
      ></CustomWhatIlearned>
    );
  };

  const [name, setName] = useState("");
  const [tempname, setTempName] = useState("");
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [tabName, name, change, user]) // dependencies of effect
  );

  const [page, setPage] = useState(1);
  const fetchMoreData = async (page) => {
    try {
      const url =
        API_BASE +
        "whatIlearned/get?" +
        (name ? `keyword=${name}&` : "") +
        `shareWithWorldWide=true&shareWithFriend=false`;
      const res = await API.get(url + `&page=${page}`);
      let tempList = res.data.entries.map((item) => {
        return {
          id: item.id,
          isFollowed:
            (user.friend ?? []).includes("" + item.author) ||
            item.author === user.id,
          AvatarImg: item.User.avatar,
          name: item.authorName,
          text: item.content,
          agreeCnt: JSON.parse(item.agree ?? "[]"),
          disagreeCnt: JSON.parse(item.disagree ?? "[]"),
          commentCnt: JSON.parse(item.comment ?? "[]").length,
          daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000 * 60)),
          isFavorite: (user.favoriteWIL ?? []).includes("" + item.id),
          author: item.author,
        };
      });
      console.log('templist',tempList);
      return tempList;
    } catch (error) {
      console.log(error);
      Toast.show(error.data.message, {
        duration: 5000,
        type: "danger",
      });
    }
  };
  const loadMoreData = async () => {
    const newData = await fetchMoreData(page + 1);

    if (newData.length > 0) {
      setWhatIlearnedList([...whatilearnedList, ...newData]);
      setPage(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 20,
          marginTop: 10,
        }}
      >
        <TextInput
          style={{
            ...styles.input,
          }}
          placeholder="Search what I learned by keywords"
          editable={true}
          value={tempname}
          onChange={(e) => setTempName(e.nativeEvent.text)}
        />
        <TouchableOpacity
          onPress={() => {
            setName(tempname);
          }}
        >
          <Image source={SearchImg}></Image>
        </TouchableOpacity>
      </View>
      <FlatList
        data={whatilearnedList}
        renderItem={renderWhatIlearned}
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 10,
    // fontFamily: 'ArialBold'
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
    fontFamily: "ArialBold",
    fontSize: 16,
    height: 26,
  },
  flatList: {
    flex: 1,

    //flexBasis:"auto",
    width: "100%",
    marginTop: 30,
  },
});

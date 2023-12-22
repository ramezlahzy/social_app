import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList, // Import FlatList
} from "react-native";
import SearchImg from '../../../../assets/image/search.png'
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import CustomWhatIlearned from "../../../components/CustomWhatIlearned";
import API from "../../../redux/API";
import { API_BASE } from "../../../config";
import { setUser } from "../../../redux/actions/user.action";
import { selectUser } from "../../../redux/selectors";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
export default () => {
  const dispatch = useDispatch();


  const [whatilearnedList, setWhatIlearnedList] = useState([])
  const user = useSelector(selectUser);
  const toast = useToast();
  const [change, setChange] = useState(false);
  // Define the renderItem function
  const renderItem = ({ item }) => {
    return (
        <CustomWhatIlearned data={item} setChange={setChange} key={"whatilearned" + item.id} flag={true} />
    );
  };
  const [name, setName] = useState('');
  const [tempname, setTempName] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      const url = API_BASE+'user/getMyFavoriteWhatIlearned?' + (name ? `keyword=${name}&` : '');
      API.get(url)
      .then(res => {
        console.log(res.data.entries);
        let tempList = res.data.entries.map(item => {
          return {id: item.id, isFollowed: ((user.friend ?? []).includes("" + item.author) || item.author === user.id), AvatarImg: item.User.avatar,name: item.authorName, text: item.content, agreeCnt: JSON.parse(item.agree ?? "[]"), disagreeCnt: JSON.parse(item.disagree ?? "[]"), commentCnt: JSON.parse(item.comment ?? "[]").length, daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000*60)), isFavorite: (user.favoriteWIL ?? []) .includes(""+item.id), author: item.author}
        })
        setWhatIlearnedList(tempList);
        if(name){
          toast.show(res.data.message, {
            duration: 5000,
            type: "success",
            placement: "bottom",
          });
        }
      })
      .catch(err => {
        console.log(err)
        toast.show(err.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
        
      })
    }, [user, name, change])
  );
  const [page, setPage] = useState(1);
  const fetchMoreData = async (page) => {
    try {
      let url = API_BASE+'user/getMyFavoriteWhatIlearned?' + (name ? `keyword=${name}&` : '');

      const res = await API.get(url + `&page=${page}`);
      let tempList = res.data.entries.map(item => {
        return {id: item.id, isFollowed: ((user.friend ?? []).includes("" + item.author) || item.author === user.id), AvatarImg: item.User.avatar,name: item.authorName, text: item.content, agreeCnt: JSON.parse(item.agree ?? "[]"), disagreeCnt: JSON.parse(item.disagree ?? "[]"), commentCnt: JSON.parse(item.comment ?? "[]").length, daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000*60)), isFavorite: (user.favoriteWIL ?? []) .includes(""+item.id), author: item.author}
      })
      console.log(tempList);
      return tempList;
    } catch (error) {
      console.log(error)
    }
  }
  const loadMoreData = async () => {
    const newData = await fetchMoreData(page + 1);
    if (newData.length > 0) {
      setWhatIlearnedList([...whatilearnedList, ...newData]);
      setPage(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
            <TextInput
                style={{
                ...styles.input,
                }}
                placeholder="Search what I learned by keywords"
                editable={true}
                value={tempname}
                onChange={(e) => setTempName(e.nativeEvent.text)}
            />
            <TouchableOpacity onPress={() => {setName(tempname)}}>
                <Image source={SearchImg}></Image>
            </TouchableOpacity>
      </View>

      <FlatList
        data={whatilearnedList}
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    paddingHorizontal: 8,
    fontWeight: '700',
    borderColor: "#4388CC",
    color: '#4388CC',
    width: "90%",
    fontSize: 16,
    fontFamily: 'ArialBold',
    height: 26,
  },
  flatList: {
    flex: 1,
    width: '100%',
    marginTop: 30,
  },
});

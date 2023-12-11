import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList
} from "react-native";
import SearchImg from '../../../../assets/image/search.png';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import CustomFriendView from "../../../components/CustomFriendView";
import { selectUser } from '../../../redux/selectors';
import API from "../../../redux/API";
import { API_BASE } from "../../../config";
export default () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // Define the renderItem function
    const renderItem = ({ item }) => {
      return (
        <CustomFriendView data={item} key={"friendview" + item.id}></CustomFriendView>
      );
    };

    const [friendsList, setFriendList] = useState([])
    const user = useSelector(selectUser);
    const [name, setName] = useState('');
    const [tempname, setTempName] = useState('');

    useEffect(() => {
      API.get(API_BASE + `user/getMyFriend?keyword=${name}`)
        .then(res => {
          let tempList = res.data.users.map(item => {
              return {id: item.id, isFollowed: true, AvatarImg: item.avatar, name: item.fullName, distance: item.distance}
          })
          setFriendList(tempList);
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
        })
    }, [name, user])
    const [page, setPage] = useState(1);
    const fetchMoreData = async (page) => {
      try {
        const res = await API.get(API_BASE + `user/getMyFriend?page=${page}&keyword=${name}`);
        let tempList = res.data.users.map(item => {
          return {id: item.id, isFollowed: true, AvatarImg: item.avatar, name: item.fullName, distance: item.distance}
        })
        console.log(tempList);
        return tempList;
      } catch (error) {
        console.log(error)
      }
    }
    const loadMoreData = async () => {
  
      // Simulate an API call or data fetch
      const newData = await fetchMoreData(page + 1);
  
      if (newData.length > 0) {
        setFriendList([...friendsList, ...newData]);
        setPage(page + 1);
      }
    };
  return (
    <View style={styles.container}>
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
            marginTop: 6
        }}>
            <TextInput 
                style={{
                ...styles.input,
                }}
                placeholder="search friends by name"
                editable={true}
                value={tempname}
                onChange={(e) => setTempName(e.nativeEvent.text)}
            />
            <TouchableOpacity onPress={() => {setName(tempname)}}>
                <Image source={SearchImg}></Image>
            </TouchableOpacity>
        </View>
      
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 10,
    // fontFamily: 'ArialBold'
  },
  input: {
    fontFamily: 'ArialBold',
    borderWidth: 2,
    paddingHorizontal: 8,
    fontWeight: '700',
    lineHeight: 18.4,
    borderColor: "#4388CC",
    color: '#4388CC',
    width: "90%",
    fontSize: 16,
    height: 26,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   FlatList
// } from "react-native";
// import SearchImg from '../../../../assets/image/search.png';
// import { useNavigation } from "@react-navigation/native";
// import { useDispatch, useSelector } from "react-redux";
// import CustomWhatIlearned from "../../../components/CustomWhatIlearned.js";
// import AvatarImage1 from '../../../../assets/image/Avatar1.png';
// import AvatarImage2 from '../../../../assets/image/Avatar2.png';
// import AvatarImage3 from '../../../../assets/image/Avatar3.png';
// import AvatarImage4 from '../../../../assets/image/Avatar4.png';
// import API from "../../../redux/API";
// import { API_BASE } from "../../../config";
// import { selectUser } from '../../../redux/selectors';
// import { useRoute } from '@react-navigation/native';
// import { useFocusEffect } from '@react-navigation/native';
// import { Toast } from "react-native-toast-notifications";
// import { useToast } from "react-native-toast-notifications";
// export default ({flag}) => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const route = useRoute();
//   const tabName = route.name;
//   console.log(tabName, flag);
//   const user = useSelector(selectUser);
//   const toast = useToast();
//   const [whatilearnedList, setWhatIlearnedList] = useState([])
  


// //  const [page, setPage] = useState(1);
//   // const [friendsList, setFriendList] = useState([])
//   // useEffect(() => {
//   //   API.get(API_BASE + `user/findAllUsersByDistance?page=${page}`)
//   //     .then(res => {
//   //       let tempList = res.data.users.map(item => {
//   //           return { distance: item.distance,...item }
//   //       })
//   //       setFriendList("tempList ",tempList);
//   //       console.log("tempList ",tempList);
//   //       toast.show(res.data.message, {
//   //         duration: 5000,
//   //         type: "success",
//   //         placement: "bottom",
//   //       });


//   //     })
//   //     .catch(err => {
//   //       console.log(err)
//   //       toast.show(err.response.data.message, {
//   //         duration: 5000,
//   //         type: "danger",
//   //         placement: "bottom",
//   //       })

        
//   //     })
//   // }, [user])


















//   const [change, setChange] = useState(false);
//     const renderWhatIlearned = ({ item }) => {
//         return (
//             <CustomWhatIlearned data={item} setChange={setChange} key={"mywhatilearned" + item.id} flag={true}></CustomWhatIlearned>
//         );
//     };

//     const [name, setName] = useState('');
//     const [tempname, setTempName] = useState('');
//     useFocusEffect(
//       React.useCallback(() => {
//         // Make your API call here
//         // You can use async/await or fetch or axios to make the API call
//         // For example, with async/await:
//         let url = '';
      
//         if(flag === 1) url = API_BASE+'whatIlearned/get?' + (name ? `keyword=${name}&` : '')+`shareWithFriend=true&shareWithWorldWide=false`;
//         else if(flag === 2) url = API_BASE+'whatIlearned/get?' + (name ? `keyword=${name}&` : '')+`shareWithWorldWide=true&shareWithFriend=false`;
//         else url = API_BASE+'whatIlearned/get?' + (name ? `keyword=${name}&=` : '');
//         const fetchData = async () => {
//           API.get(url)
//           .then(res => {
//             console.log(flag, user)
//             let tempList = res.data.entries.map(item => {
//               return {id: item.id, isFollowed: ((user.friend ?? []).includes("" + item.author) || item.author === user.id), AvatarImg: item.User.avatar,name: item.authorName, text: item.content, agreeCnt: JSON.parse(item.agree ?? "[]"), disagreeCnt: JSON.parse(item.disagree ?? "[]"), commentCnt: JSON.parse(item.comment ?? "[]").length, daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000*60)), isFavorite: (user.favoriteWIL ?? []) .includes(""+item.id), author: item.author, }
//           })
//             setWhatIlearnedList(tempList);
//           })
//           .catch(err => {
//             console.log(err);
//           })
//         };
  
//         fetchData();
  
//         // Clean up any subscriptions or timers if needed
//         return () => {
//           // Cleanup code (if any)
//         };
//       }, [tabName, name, change, user]) // dependencies of effect
//     );

//     const [page, setPage] = useState(1);
//     const fetchMoreData = async (page) => {
//       try {
//         let url = "";
//         if(flag === 1) url = API_BASE+'whatIlearned/get?' + (name ? `keyword=${name}&` : '')+`shareWithFriend=true&shareWithWorldWide=false`;
//         else if(flag === 2) url = API_BASE+'whatIlearned/get?' + (name ? `keyword=${name}&` : '')+`shareWithWorldWide=true&shareWithFriend=false`;
//         else url = API_BASE+'whatIlearned/get?' + (name ? `keyword=${name}&=` : '');
//         const res = await API.get(url + `&page=${page}`);
//         let tempList = res.data.entries.map(item => {
//           return {id: item.id, isFollowed: ((user.friend ?? []).includes("" + item.author) || item.author === user.id), AvatarImg: item.User.avatar,name: item.authorName, text: item.content, agreeCnt: JSON.parse(item.agree ?? "[]"), disagreeCnt: JSON.parse(item.disagree ?? "[]"), commentCnt: JSON.parse(item.comment ?? "[]").length, daysAgo: ~~((Date.now() - new Date(item.createdAt)) / (1000*60)), isFavorite: (user.favoriteWIL ?? []) .includes(""+item.id), author: item.author}
//         })
//         console.log(tempList);
//         return tempList;
//       } catch (error) {
//         console.log(error)
//         Toast.show(error.data.message, {
//           duration: 5000,
//           type: "danger"
//         })

//       }
//     }
//     const loadMoreData = async () => {
  
//       // Simulate an API call or data fetch
//       const newData = await fetchMoreData(page + 1);
  
//       if (newData.length > 0) {
//         setWhatIlearnedList([...whatilearnedList, ...newData]);
//         setPage(page + 1);
//       }
//     };

//   return (
//     <View style={styles.container}>
        
     
//         <View style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: "100%",
//             paddingHorizontal: 20,
//             marginTop: 10
//         }}>
//           <TextInput 
//                 style={{
//                 ...styles.input,
//                 }}
//                 placeholder="Search what I learned by keywords"
//                 editable={true}
//                 value={tempname}
//                 onChange={(e) => setTempName(e.nativeEvent.text)}
//             />
//             <TouchableOpacity onPress={() => {setName(tempname)}}>
//                 <Image source={SearchImg}></Image>
//             </TouchableOpacity>
//         </View>
//         <FlatList
//             data={whatilearnedList}
//             renderItem={renderWhatIlearned}
//             keyExtractor={(item) => item.id.toString()}
//             onEndReached={loadMoreData}
//             style={styles.flatList}
//         />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     paddingTop: 10,
//     // fontFamily: 'ArialBold'
//   },
//   input: {
//     fontFamily: 'ArialBold',
//     borderWidth: 2,
//     paddingHorizontal: 8,
//     fontWeight: '700',
//     lineHeight: 18.4,
//     borderColor: "#4388CC",
//     color: '#4388CC',
//     width: "90%",
//     fontFamily: 'ArialBold',
//     fontSize: 16,
//     height: 26,
//   },
//   flatList: {
//     flex: 1,

//     //flexBasis:"auto",
//     width: '100%',
//     marginTop:30
//   },
// });

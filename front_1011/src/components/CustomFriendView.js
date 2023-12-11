import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { IMG_URL } from '../config';
import API from '../redux/API';
import { setUser } from '../redux/actions/user.action';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
export default ({data}) => {
    const { isFollowed , AvatarImg , name, distance, id} = data;
    const dispatch = useDispatch();
    const toast = useToast();
    const navigate = useNavigation();
    const followAPI = async () => {
        try {
            const response = await API.post('user/followUser', {followUserID: "" + id});
            dispatch(setUser(response.data.user))
            toast.show(response.data.message, {
                duration: 5000,
                type: "success",
                placement: "bottom",
              });
        } catch (error) {
            if(error?.response?.data?.message){
                toast.show(error.response.data.message, {
                  duration: 5000,
                  type: "danger",
                  placement: "bottom",
                });
              }
              console.log(error);
        }
    }
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: "space-around",
            alignItems: 'center',
            borderBottomColor: '#4388CC',
            borderBottomWidth: 2
        }}>
            <View style={{
                alignItems: 'center',
                paddingVertical: 18
            }}>
                <TouchableOpacity onPress={() => {navigate.navigate('whatilearned', { screen: 'Friends', params:{screen : "BY LOCATION", params: {friendAvatar : AvatarImg,  friendID: id, friendName: name, distance: distance.toFixed(2), isFollowed}} })}}>
                <Image source={{uri: (IMG_URL + AvatarImg)}} style={{
                    borderWidth: 3,
                    borderColor: isFollowed ? "#4388CC" : "#F31B1B",
                    borderRadius: 40,
                    width: 80,
                    height: 80 
                }}></Image>
                </TouchableOpacity>
              
                <Text style={{
                    color: "#4388CC",
                    fontSize: 16,
                    lineHeight: 18.4,
                    fontWeight: '700',
                    fontFamily: 'ArialBold',
                }}>{name}</Text>
         
                <Text style={{
                    color: "#2E8B57",
                    fontSize: 12,
                    fontWeight: '700',
                    marginTop: 8,
                    fontFamily: 'ArialBold'
                }}>{distance.toFixed(2)} mile from you</Text>
            </View>
            <TouchableOpacity disabled={isFollowed} onPress={() => followAPI()}>
                <Text style={{
                    color: "#4388CC",
                    fontSize: 16,
                    lineHeight: 18.4,
                    fontWeight: '700',
                    fontFamily: 'ArialBold',
                    borderBottomColor: '#4388CC',
                    borderBottomWidth: isFollowed ? 2 : 0
                }}>{isFollowed ? "Followed" : "Follow"}</Text>
            </TouchableOpacity>
           <TouchableOpacity disabled={!isFollowed} onPress={() => followAPI()}>
                <Text style={{
                    color: "#F31B1B",
                    fontSize: 16,
                    lineHeight: 18.4,
                    fontWeight: '700',
                    fontFamily: 'ArialBold',
                    borderBottomColor: '#4388CC',
                    borderBottomWidth: !isFollowed ? 2 : 0
                }}>{isFollowed ? "unfollow" : "unfollowed"}</Text>
           </TouchableOpacity>

           

       </View>
       
    )
}

const styles = StyleSheet.create({
    textNormal1:{
        fontSize: 16,
        lineHeight: 18.4,
        fontWeight: '700',
        color: '#4388CC',
    },
    textNormal2:{
        fontSize: 16,
        lineHeight: 18.4,
        fontWeight: '700',
        color: '#F31B1B',
    },
    textNormal3:{
        fontSize: 16,
        lineHeight: 18.4,
        fontWeight: '700',
        color: '#2E8B57',
    },
    textSmall: {
        fontSize: 10,
        lineHeight: 11.5,
        fontWeight: '700',
        color: '#F31B1B'
    }
});
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList, // Import FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import API from "../../../redux/API";
import { useFocusEffect } from '@react-navigation/native';
export default ({notification, setNotification}) => {

  const navigate = useNavigation();
  const dispatch = useDispatch();
  useFocusEffect( React.useCallback(() => {
    if(notification.count > 0){
      API.get('user/setNotificationViewed')
      .then((res) => {
        setNotification({notification: res.data.notification, count : 0})
        console.log(res.data)
      })
      .catch(err => console.log(JSON.stringify(err)))
    }
    
  }, []))
  const formatDateTime = (datetimeString) => {
    const date = new Date(datetimeString);
  
    // Extract date components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    // Format as "hh:mm MM/DD/YYYY"
    const formattedDateTime = `${hours}:${minutes} ${month}/${day}/${year}`;
  
    return formattedDateTime; 
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={notification.notification}
        renderItem={({ item }) => (
          <View>
              <View style={item.viewed ? styles.readNotification : styles.unreadNotification}>
              <TouchableOpacity disabled={!item.content.includes('WhatILearned')} onPress={() => {
                navigate.navigate('whatilearned', { screen: 'Friends', params:{screen : "MY PROFILE", params: {id: item.data}}});
              }}>
                <Text style={{color: '#4388CC'}}>{item.content}</Text>
              </TouchableOpacity>
              
                {/* {item.viewed ? null : (
                  <TouchableOpacity onPress={() => markNotificationAsRead(item.id)}>
                    
                  </TouchableOpacity>
                )} */}
              </View>
              <Text style={{
                width: '100%',
                textAlign: 'right',
                paddingRight: 10
              }}>{formatDateTime(item.createdAt)}</Text>
          </View>
        
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  readNotification: {
    borderWidth: 2,
    borderColor: '#DDAA11', // Read notification background color
    padding: 20,
    flexDirection: 'row',
  },
  unreadNotification: {
    backgroundColor: '#DDAA11', // Unread notification background color
    padding: 20,
    flexDirection: 'row',
    color: '#4388CC'
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // fontFamily: 'ArialBold'
  },
});
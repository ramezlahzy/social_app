import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from "../../../redux/selectors";
import { Text } from 'react-native';


const ChatList = () => {
    const user = useSelector(selectUser);
    //navigation
    return (
       <Text>
              ChatList
       </Text>
    )
}
export default ChatList;
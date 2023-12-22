import React from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from "../../../redux/selectors";
import { createStackNavigator } from '@react-navigation/stack';
import OneChat from './OneChat';
import ChatList from './ChatList';

const { Navigator, Screen } = createStackNavigator();


const ChatScreen = () => {
    const user = useSelector(selectUser);
    //navigation    
    return (
        <Navigator>
            <Screen name="ChatList" component={ChatList}  options={{ headerShown: false }}/>
            <Screen name="OneChat" component={OneChat} options={{ headerShown: false }}  />
        </Navigator>

    )
}
export default ChatScreen
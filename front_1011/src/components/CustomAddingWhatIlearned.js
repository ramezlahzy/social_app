import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking , KeyboardAvoidingView } from 'react-native';
import { Checkbox } from "react-native-paper";
import API from "../redux/API";
import { useToast } from "react-native-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user.action";
import { selectUser } from "../redux/selectors";
export default ({data}) => {
    const [txt, setTxt] = useState('')
    const [shareWithFriend, setShareWithFriend] = useState(true);
    const [shareWithWorldWide, setShareWithWorldWide] = useState(true);
    const dispatch = useDispatch();
    const toast = useToast();
    const addAPI = async () => {
        try {
            if(txt.length === 0) return;
            const response = await API.post('whatIlearned/add', {content: txt, shareWithFriend, shareWithWorldWide});
            toast.show(response.data.message, {
                duration: 5000,
                type: "success",
                placement: "bottom",
              });
              dispatch(setUser(response.data.user))
              setTxt('');
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

        <KeyboardAvoidingView style={{
            alignItems: 'center',
            paddingHorizontal: 52,
            paddingVertical: 32,
            width: '100%',
            flex: 1
       }}>
           
           
            <View style={{
                marginTop: 7,
                width: '100%',
                //flex: 1,
                borderColor:  "#4388CC",
                borderWidth: 2,
                //height: 376,
            }}>
                <TextInput multiline={true} 
                style={{
                    //flex: 1,
                   // height: 234,
                   maxHeight:234,
                    paddingTop: 19,
                    paddingHorizontal: 10,
                    borderColor:  "#4388CC",
                    color: '#4388CC',
                    borderBottomWidth: 2,
                    textAlignVertical: 'top',
                    fontFamily: 'ArialBold',
                    
                }} value={txt} onChange={(e) => {
                    setTxt(e.nativeEvent.text.length > 840 ? txt : e.nativeEvent.text )
                }}></TextInput>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 19,
                    borderColor:  "#4388CC",
                    borderBottomWidth: 2,
                }}>
                    <Text style={{
                        width: '100%',
                        textAlign: "center",
                        fontSize: 24,
                        fontWeight: '700',
                        fontFamily: 'ArialBold',
                        color: '#4388CC',
                    }}>{txt.length} / 840</Text>
                </View>
                <View>
                    <View style={styles.textshare}>
                        <Text style={styles.textNormal1}>SHARE WITH FRIENDS </Text>
                        <Checkbox
                            status={shareWithFriend ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setShareWithFriend(!shareWithFriend);
                            }}
                            color="#2E8B57"
                            
                        />
                    </View>
                    <View style={styles.textshare}>
                        <Text style={styles.textNormal2}>SHARE WITH WORLDWIDE </Text>
                        <Checkbox
                            status={shareWithWorldWide ? 'checked' : 'unchecked'} 
                            onPress={() => {
                                setShareWithWorldWide(!shareWithWorldWide);
                            }}
                            color="#2E8B57"
                            
                        />
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.sharebutton} onPress={() => {addAPI()}}>
                <Text style={styles.textButton}>SHARE</Text>
            </TouchableOpacity>
            
       </KeyboardAvoidingView>
       
    )
}

const styles = StyleSheet.create({
    sharebutton: {
        borderColor: '#4388CC',
        borderWidth: 5,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 5
    },
    textButton:{
        fontSize: 40,
        fontWeight: '700',
        color: '#4388CC',
    },
    textNormal1:{
        fontSize: 16,
        lineHeight: 18.4,
        fontWeight: '700',
        color: '#4388CC',
        width: 210,
        fontFamily: 'ArialBold',
    },
    textNormal2:{
        fontSize: 16,
        lineHeight: 18.4,
        fontWeight: '700',
        color: '#F31B1B',
        width: 210,
        fontFamily: 'ArialBold',
    },
    textNormal3:{
        fontSize: 16,
        lineHeight: 18.4,
        fontWeight: '700',
        color: '#4388CC',
    },
    textshare: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        fontFamily: 'ArialBold',
        paddingLeft: 12,
        paddingRight: 50
    }
});
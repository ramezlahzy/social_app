import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import { setUser } from '../../redux/actions/user.action';
import {CountryPicker} from "react-native-country-codes-picker";
import API from '../../redux/API';
import { API_BASE } from '../../config';
import { useToast } from 'react-native-toast-notifications';
export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [phone, setPhone] = useState('11111');
  const [pincode, setPincode] = useState('333333');

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('AS +244');
  const toast = useToast();

  const user = useSelector(selectUser);
  const [token, setToken] = useState(null)
  useEffect(()=>{
    const fetchToken = async () => {
      const storedToken = await getTokenFromAyncStorage();
      if (storedToken !== null) {
        setToken(storedToken);
      }
    };

    fetchToken();
  },[]);

  const getTokenFromAyncStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        return value;
      } else {
        console.log('Data not found');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }
  const handleConfirm = async () => {
    const phoneNumber = countryCode.substring(countryCode.indexOf("+")+1) + phone;
    try {
      const response = await API.get(API_BASE+`user/generatePin?phoneNumber=${phoneNumber}`);
      toast.show(response.data.message, {
        duration: 5000,
        type: "success",
        placement: "bottom",
      });

    } catch (error) {
      console.log(error);
      if(error?.response?.data?.message){
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
  }
  const handleVerify = async () => {
    try {
      const data = { phoneNumber : countryCode.substring(countryCode.indexOf("+")+1) + phone, pinCode: pincode  }

      const response = await API.post(API_BASE+`user/verifyPin`, data);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('phoneNumber', countryCode.substring(countryCode.indexOf("+")+1) + phone);
      toast.show(response.data.message, {
        duration: 5000,
        type: "success",
        placement: "bottom",
      });
      if(response.data.state === 0) navigation.navigate("SignUp");
      else {
        console.log("response.data.user",response.data.user);
        dispatch(setUser(response.data.user));
        navigation.navigate('whatilearned');
      }


    } catch (error) {
      if(error?.response?.data?.message){
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }

      console.log(error.response.data);
    }
  }
  const inputHandle = (type, text) => {
    switch (type) {
      case "phone":
        setPhone(text);
        break;
      case "pincode":
        setPincode(text);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}> 
      <View style={styles.phoneForm}>
        <View style={{
          width: "23%"
        }}>
          <Text style={styles.countryLabel}>COUNTRY</Text>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
                borderColor: 'black',
            }}
          >
            <Text style={styles.inputCountryCode}>
                {countryCode}
            </Text>
          </TouchableOpacity>
          <CountryPicker
            show={show}
            pickerButtonOnPress={(item) => {
              setCountryCode(item.code + " " +  item.dial_code);
              setShow(false);
            }}
          />
          
        </View>
        <View style={{
          width: "50%"
        }}>
          <Text style={styles.phoneLabel}>ADD YOUR PHONE</Text>
          <TextInput style={styles.phoneInput} value={phone} onChangeText={text=>inputHandle('phone', text)} />
        </View>
      </View>
      
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>CONFIRM</Text>
      </TouchableOpacity>
      <View style={{
        marginTop: 113,
        marginBottom: 15,
          alignItems: 'center',
        }}>
          <Text style={styles.pinLabel}>PLEASE ENTER PIN</Text>
          <Text style={styles.pinLabel}>SENT VIA SMS</Text>
      </View>
      <TextInput style={styles.pinInput} value={pincode} onChangeText={text=>inputHandle('pincode', text)} />

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>VERIFY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    alignItems: 'center',
    paddingTop: 125,
    paddingLeft: 18,
    paddingRight: 18,
  },
  phoneForm: {
    flexDirection: "row",
    justifyContent: 'space-around',
    width: "100%"
  },
  countryLabel: {
    color: '#4388CC',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 18.4,
    textAlign: 'right',
    fontFamily: 'ArialBold',
  },
  phoneLabel: {
    color: '#4388CC',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 18.4,
    fontFamily: 'ArialBold',
  },
  
  phoneInput: {
    borderWidth: 2,
    borderColor: '#4388CC',
    paddingHorizontal: 5,
    width: '100%',
    fontSize: 16,
    color: '#F31B1B',
    height: 22,
    fontFamily: 'ArialBold',
    fontWeight: '700',
    textAlign: 'center'
  },
  pinLabel: {
    color: '#2E8B57',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 18.4,
    textAlign: "center",
    width: '100%',
    fontFamily: 'ArialBold',
  },
  pinInput: {
    borderWidth: 2,
    borderColor: '#2E8B57',
    paddingHorizontal: 5,
    width: 220,
    fontSize: 16,
    color: '#F31B1B',
    height: 22,
    fontFamily: 'ArialBold',
    fontWeight: '700',
    textAlign: "center"
  },
  countryTxt: {
    borderWidth: 2,
    borderColor: '#4388CC',
    paddingHorizontal: 5,
    width: '100%',
    fontSize: 16,
    color: '#F31B1B',
    height: 22,
    fontFamily: 'ArialBold',
    fontWeight: '700'
  },
 
  inputCountryCode : {
    borderWidth: 2,
    borderColor: '#4388CC',
    paddingHorizontal: 5,
    width: '100%',
    fontSize: 16,
    color: '#F31B1B',
    height: 22,
    textAlign: 'right',
    fontFamily: 'ArialBold',
    fontWeight: '700'
  },
  confirmButton: {
    borderColor: '#F31B1B',
    borderWidth: 3,
    borderRadius: 34,
    marginTop: 22,
    alignItems: 'center',
    width: 133,
    height: 52,
    backgroundColor: '#FFCC33',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmButtonText: {
    color: '#F31B1B',
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'ArialBold',

  },
  verifyButton: {
    borderColor: '#F31B1B',
    borderWidth: 3,
    borderRadius: 34,
    marginTop: 30,
    alignItems: 'center',
    width: 133,
    height: 52,
    backgroundColor: '#FFCC33',
    justifyContent: 'center',

  },
  verifyButtonText: {
    color: '#2E8B57',
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'ArialBold',
  },
});
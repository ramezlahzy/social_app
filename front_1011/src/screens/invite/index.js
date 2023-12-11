import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { registerUser } from '../../redux/authReducer';

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [progress, setProgress] = useState(0);
  const navigateToVerify = () => {
    navigation.navigate("VerifyEmailForSignUp", { email, next: 'Login' });
  };

  const onSignUp = () => {
    const userData = { firstName, lastName, email, username, password };
    dispatch(registerUser(userData, navigateToVerify));
  };

  const handleUpload = () => {
    setProgress(1);
  }
  const handleSubmitName = () => {
    setProgress(2);
  }
  const handleSubmitLocation = () => {
    
  }

  const inputHandle = (type, text) => {
    switch (type) {
      case "firstName":
        setFirstName(text);
        break;
      case "lastName":
        setLastName(text);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite</Text>
      <Text style={styles.link}>Facebook</Text>
      <Text style={styles.link}>Whatsapp</Text>
      <Text style={styles.link}>Phone</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 132,
    paddingLeft: 53,
    paddingRight: 53,
    // fontFamily: 'ArialBold'
  },
  title: {
    fontSize: 16,
    lineHeight: 18.4,
    fontWeight: '700',
    fontFamily: "ArialBold",
    marginBottom: 34,
    color: "#2E8B57",
  },
  link: {
    fontSize: 16,
    lineHeight: 18.4,
    fontWeight: '700',
    fontFamily: "ArialBold",
    marginBottom: 25,
    color: "#4388CC",
    width: '100%'
  },
});

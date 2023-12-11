import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import SearchImg from '../../../../assets/image/search.png';
import CustomInput from "../../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import CustomAddingWhatIlearned from "../../../components/CustomAddingWhatIlearned";


export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <CustomAddingWhatIlearned></CustomAddingWhatIlearned>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 32,
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
    fontFamily: 'ArialBold',
    fontSize: 16,
    height: 26,
  },
});

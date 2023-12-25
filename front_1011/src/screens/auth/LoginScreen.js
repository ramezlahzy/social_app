import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors";
import { setUser } from "../../redux/actions/user.action";
import { CountryPicker } from "react-native-country-codes-picker";
import API from "../../redux/API";
import { API_BASE } from "../../config";
import { useToast } from "react-native-toast-notifications";
import {
  app,
  auth,
  PhoneAuthProvider,
  signInWithCredential,
} from "../../../firebase";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState("");
  const [message, showMessage] = React.useState("");
  const [timer, setTimer] = useState(60);
  const [isResend, setIsResend] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const phoneNumber = auth.currentUser.phoneNumber.replace("+", "");
      console.log(
        "existed phon e     numbers   " + phoneNumber
      );
      
      API.get(
        API_BASE +
          `user/getUserByPhoneNumber?phoneNumber=${phoneNumber}`
      )
        .then((response) => {
          console.log("respdose.data.user", response.data.user);
          if(response.data.user){
            if (response.data.user.blocked) {
              toast.show("you are blocked", { type: "danger" });
            }
            dispatch(setUser(response.data.user));
            navigation.navigate("whatilearned");
          }else{
            navigation.navigate("SignUp");
          }
         
        })
        .catch((error) => {
          console.log("error", error);
          toast.show(`Eror: ${error.message}`, {
            type: "danger",
          });
        });
    } //else navigation.navigate("SignUp");
  }, []);
  const sendVerification = async () => {
    try {
      const phoneNumber = countryCode + phone;
      const phoneProvider = new PhoneAuthProvider(auth);
      console.log(phoneNumber);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      console.log(verificationId);
      setVerificationId(verificationId);
      toast.show("Verification code has been sent to your phone.", {
        type: "success",
      });
    } catch (err) {
      toast.show(`Error: ${err.message}`, {
        type: "danger",
      });

      showMessage(`Error: ${err.message}`);
      console.log(err);
    }
  };

  useEffect(() => {
    //is user already logged in
    // if(user){
    //   navigation.navigate("whatilearned");
    // }
  }, []);
  // const [phone, setPhone] = useState("1550575832");
  const [phone, setPhone] = useState("1275817179");

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("EG +20");
  const toast = useToast();

  const user = useSelector(selectUser);

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      console.log("user  ", user);
      const phone_number =
        countryCode.substring(countryCode.indexOf("+") + 1) + phone;
        console.log("phone_number  ", phone_number);  
      const response = await API.get(
        API_BASE + `user/getUserByPhoneNumber?phoneNumber=${phone_number}`
      );
      await AsyncStorage.setItem("phoneNumber", phone_number);
      console.log("response.data.user", response.data.user);
      if (response.data.user) {
        if (response.data.user.blocked) {
          toast.show("you are blocked", {
            type: "danger",
          });
          return;
        } else {
          dispatch(setUser(response.data.user));
          navigation.navigate("whatilearned");
        }
      } else {
        navigation.navigate("SignUp");
      }
      toast.show("Phone authentication successful ", {
        type: "success",
      });
    } catch (err) {
      toast.show(`Error: ${err.message}`, {
        type: "danger",
      });

      showMessage(`Error: ${err.message}`);
      console.log(`Error: ${err.message}`);
    }
  };
  // const handleConfirm = async () => {
  //   // try {
  //   //   const response = await API.get(
  //   //     API_BASE + `user/generatePin?phoneNumber=${phoneNumber}`
  //   //   );
  //   //   toast.show(response.data.message, {
  //   //     duration: 5000,
  //   //     type: "success",
  //   //     placement: "bottom",
  //   //   });
  //   // } catch (error) {
  //   //   console.log(error);
  //   //   if (error?.response?.data?.message) {
  //   //     toast.show(error.response.data.message, {
  //   //       duration: 5000,
  //   //       type: "danger",
  //   //       placement: "bottom",
  //   //     });
  //   //   }
  //   // }
  // };
  // const handleVerify = async () => {
  //   try {
  //     confirmCode();
  //     // const data = {
  //     //   phoneNumber:
  //     //     countryCode.substring(countryCode.indexOf("+") + 1) + phone,
  //     //   pinCode: pincode,
  //     // };
  //     // const response = await API.post(API_BASE + `user/verifyPin`, data);
  //     // await AsyncStorage.setItem("token", response.data.token);
  //     // await AsyncStorage.setItem(
  //     //   "phoneNumber",
  //     //   countryCode.substring(countryCode.indexOf("+") + 1) + phone
  //     // );
  //     // toast.show(response.data.message, {
  //     //   duration: 5000,
  //     //   type: "success",
  //     //   placement: "bottom",
  //     // });
  //     // if (response.data.state === 0) navigation.navigate("SignUp");
  //     // else {
  //     //   console.log("response.data.user", response.data.user);
  //     //   dispatch(setUser(response.data.user));
  //     //   navigation.navigate("whatilearned");
  //     // }
  //   } catch (error) {
  //     if (error?.response?.data?.message) {
  //       toast.show(error.response.data.message, {
  //         duration: 5000,
  //         type: "danger",
  //         placement: "bottom",
  //       });
  //     }

  //     console.log(error.response.data);
  //   }
  // };
  const inputHandle = (type, text) => {
    switch (type) {
      case "phone":
        setPhone(text);
        break;
      case "pincode":
        setVerificationCode(text);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <View style={styles.phoneForm}>
        <View
          style={{
            width: "23%",
          }}
        >
          <Text style={styles.countryLabel}>COUNTRY</Text>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
              borderColor: "black",
            }}
          >
            <Text style={styles.inputCountryCode}>{countryCode}</Text>
          </TouchableOpacity>
          <CountryPicker
            show={show}
            pickerButtonOnPress={(item) => {
              setCountryCode(item.code + " " + item.dial_code);
              setShow(false);
            }}
          />
        </View>
        <View
          style={{
            width: "50%",
          }}
        >
          <Text style={styles.phoneLabel}>ADD YOUR PHONE</Text>
          <TextInput
            style={styles.phoneInput}
            value={phone}
            keyboardType="number-pad"
            placeholder="PHONE"
            maxLength={10}
            onChangeText={(text) => inputHandle("phone", text)}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={sendVerification}>
        <Text style={styles.confirmButtonText}>CONFIRM</Text>
      </TouchableOpacity>
      <View
        style={{
          marginTop: 113,
          marginBottom: 15,
          alignItems: "center",
        }}
      >
        <Text style={styles.pinLabel}>PLEASE ENTER PIN</Text>
        <Text style={styles.pinLabel}>SENT VIA SMS</Text>
      </View>
      <TextInput
        style={styles.pinInput}
        placeholder="PIN"
        keyboardType="number-pad"
        value={verificationCode}
        onChangeText={(text) => inputHandle("pincode", text)}
      />

      <TouchableOpacity style={styles.verifyButton} onPress={confirmCode}>
        <Text style={styles.verifyButtonText}>VERIFY</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 125,
    paddingLeft: 18,
    paddingRight: 18,
  },
  phoneForm: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  countryLabel: {
    color: "#4388CC",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 18.4,
    textAlign: "right",
    fontFamily: "ArialBold",
  },
  phoneLabel: {
    color: "#4388CC",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 18.4,
    fontFamily: "ArialBold",
  },

  phoneInput: {
    borderWidth: 2,
    borderColor: "#4388CC",
    paddingHorizontal: 5,
    width: "100%",
    fontSize: 16,
    color: "#F31B1B",
    height: 22,
    fontFamily: "ArialBold",
    fontWeight: "700",
    textAlign: "center",
  },
  pinLabel: {
    color: "#2E8B57",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 18.4,
    textAlign: "center",
    width: "100%",
    fontFamily: "ArialBold",
  },
  pinInput: {
    borderWidth: 2,
    borderColor: "#2E8B57",
    paddingHorizontal: 5,
    width: 220,
    fontSize: 16,
    color: "#F31B1B",
    height: 22,
    fontFamily: "ArialBold",
    fontWeight: "700",
    textAlign: "center",
  },
  countryTxt: {
    borderWidth: 2,
    borderColor: "#4388CC",
    paddingHorizontal: 5,
    width: "100%",
    fontSize: 16,
    color: "#F31B1B",
    height: 22,
    fontFamily: "ArialBold",
    fontWeight: "700",
  },

  inputCountryCode: {
    borderWidth: 2,
    borderColor: "#4388CC",
    paddingHorizontal: 5,
    width: "100%",
    fontSize: 16,
    color: "#F31B1B",
    height: 22,
    textAlign: "right",
    fontFamily: "ArialBold",
    fontWeight: "700",
  },
  confirmButton: {
    borderColor: "#F31B1B",
    borderWidth: 3,
    borderRadius: 34,
    marginTop: 22,
    alignItems: "center",
    width: 133,
    height: 52,
    backgroundColor: "#FFCC33",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#F31B1B",
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "ArialBold",
  },
  verifyButton: {
    borderColor: "#F31B1B",
    borderWidth: 3,
    borderRadius: 34,
    marginTop: 30,
    alignItems: "center",
    width: 133,
    height: 52,
    backgroundColor: "#FFCC33",
    justifyContent: "center",
  },
  verifyButtonText: {
    color: "#2E8B57",
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "ArialBold",
  },
});

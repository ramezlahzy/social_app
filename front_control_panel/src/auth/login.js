import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { ActivityIndicator } from "react-native-paper";
import Admin from "../../assets/admin.jpg";
import API from "../redux/API";
import { API_BASE } from "../config";
import {
  app,
  auth,
  PhoneAuthProvider,
  signInWithCredential,
} from "../../firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState();
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState();
  const toast = useToast();

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      toast.show("Verification code has been sent to your phone.", {
        type: "success",
      });
    } catch (err) {
      toast.show(`Error: ${err.message}`, {
        type: "danger",
      });
    }
  };

  useEffect(() => {
    console.log("useEffect");
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("MainScreen");
      }
    }
    );
  }, []);

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);

      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      toast.show("Phone authentication successful 👍");
      navigation.navigate("MainScreen");
    } catch (err) {
      toast.show(`Error: ${err.message}`, {
        type: "danger",
      });
    }
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column",
      }}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 30,
          marginTop: 70,
          textAlign: "center",
        }}
      >
        Admin Panel
      </Text>
      <Image
        source={Admin}
        style={{
          width: 200,
          height: 200,
          marginTop: 30,
          alignSelf: "center",
        }}
      />
      <View
        style={{
          marginTop: 30,
          width: "90%",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            marginBottom: 10,
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          phone number
        </Text>
        <TextInput
          style={{
            elevation: 5,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            shadowOpacity: 0.26,
            backgroundColor: "white",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            width: "100%",
            fontSize: 15,
            textAlign: "center",
            letterSpacing: 2,
          }}
          placeholder="+20*********"
          onChange={(e) => setPhone(e.nativeEvent.text)}
          value={phone}
        />
        <Text
          style={{
            fontSize: 15,
            marginBottom: 10,
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          OTP
        </Text>
        <TextInput
          placeholder="******"
          keyboardType="numeric"
          style={{
            elevation: 5,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            shadowOpacity: 0.26,
            backgroundColor: "white",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            width: "100%",
            fontSize: 15,
            textAlign: "center",
            letterSpacing: 2,
          }}
          onChange={(e) => setOtp(e.nativeEvent.text)}
          value={otp}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#304D30",
          width: "90%",
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          marginTop: 20,
          alignSelf: "center",
        }}
        onPress={sendVerification}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>send otp</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#000",
          width: "90%",
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          marginTop: 20,
          alignSelf: "center",
          marginBottom: 20,
        }}
        onPress={confirmCode}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

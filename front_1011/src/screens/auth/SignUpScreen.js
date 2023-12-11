import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import CustomInput from "../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/authReducer";
import * as Location from "expo-location";
import { getTokenFromAyncStorage } from "../../util";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";
import API from "../../redux/API";
import { API_BASE } from "../../config";
import { setUser } from "../../redux/actions/user.action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import BR from "../../components/BR";
import Checkbox from "expo-checkbox";
import { AntDesign } from "@expo/vector-icons";

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigateToVerify = () => {
    navigation.navigate("VerifyEmailForSignUp", { email, next: "Login" });
  };

  //john
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [isTermsReaded, setIsTermsReaded] = useState(false);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [isLocationSubmitted, setIsLocationSubmitted] = useState(false);

  // const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [viewTerms, setViewTerms] = useState(false);

  const onSignUp = () => {
    const userData = { firstName, lastName, email, username, password };
    dispatch(registerUser(userData, navigateToVerify));
  };
  const [selectedImage, setSelectedImage] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      //john
      // const result = await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Set the aspect ratio to 1:1 for a square image
      quality: 1, // Image quality (0 to 1)
    });

    if (!result.canceled) {
      // Handle the selected image (e.g., display it or upload it)
      console.log(result.assets[0]);
      setSelectedImage(result.assets[0].uri);
      // You can set the selected image in state or upload it to a server here
    }
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);
  const handleUpload = () => {
    console.log(getTokenFromAyncStorage());
    if (selectedImage) setIsPhotoUploaded(true);
  };
  const handleSubmitName = () => {
    if (firstName && lastName) setIsNameSubmitted(true);
  };

  const getCityAndCountry = async (latitude, longitude) => {
    let locationData = await Location.reverseGeocodeAsync({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    if (locationData.length > 0) {
      let city = locationData[0].city;
      let country = locationData[0].country;
      setCity(city);
      setCountry(country);
      console.log("City:", city);
      console.log("Country:", country);

      // You can save the city and country in your component's state or use it as needed
    }
  };

  const handleSubmitLocation = async () => {
    const phoneNumber = await AsyncStorage.getItem("phoneNumber");
    console.log("City:", city);
    console.log("Country:", country);
    const userData = {
      firstName,
      lastName,
      phoneNumber,
      city: city,
      country: country,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    const formData = new FormData();
    formData.append("avatar", {
      uri: selectedImage,
      name: "avatar.jpg",
      type: "image/jpeg",
    });
    formData.append("userData", JSON.stringify(userData));
    try {
      const response = await API.post("user/addUser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setUser(response.data.data));
      toast.show(response.data.message, {
        duration: 5000,
        type: "success",
        placement: "bottom",
      });
      navigation.navigate("whatilearned");
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.show(error.response.data.message, {
          duration: 5000,
          type: "danger",
          placement: "bottom",
        });
      }
    }
  };
  const handlePickLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    try {
      setLocation({ latitude: 1.35362, longitude: 103.84435 });
      getCityAndCountry(location.latitude, location.longitude);
      setIsLocationSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

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
    <ScrollView style={styles.container}>
      <Modal
        visible={viewTerms}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setViewTerms(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "90%",
              height: "90%",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Terms and Conditions
            </Text>
            <ScrollView>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                1. Introduction
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                These Website Standard Terms and Conditions written on this
                webpage shall manage your use of our website, Webiste Name
                accessible at Website.com.
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                2. Intellectual Property Rights
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Other than the content you own, under these Terms, Company Name
                and/or its licensors own all the intellectual property rights
                and materials contained in this Website.
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                3. Restrictions
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                You are specifically restricted from all of the following:
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                publishing any Website material in any other media;
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                selling, sublicensing and/or otherwise commercializing any
                Website material;
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                publicly performing and/or showing any Website material;
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                using this Website in any way that is or may be damaging to this
                Website;
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                using this Website in any way that impacts user access to this
                Website;
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                using this Website contrary to applicable laws and regulations,
                or in any way may cause harm to the Website, or to any person or
                business entity;
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                engaging in any data mining, data harvesting, data extracting or
                any other similar activity in relation to this Website;
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                using this Website to engage in any advertising or marketing.
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Certain areas of this Website are restricted from being access
                by you and Company Name may further restrict access by you to
                any areas of this Website, at any time, in absolute discretion.
                Any user ID and password you may have for this Website are
                confidential and you must maintain confidentiality as well.
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                4. Your Content
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                In these Website Standard Terms and Conditions, “Your Content”
                shall mean any audio, video text, images or other material you
                choose to display on this Website. By displaying Your Content,
                you grant Company Name a non-exclusive, worldwide irrevocable,
                sub licensable license to use, reproduce, adapt, publish,
                translate and distribute it in any and all media.
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Your Content must be your own and must not be invading any
                third-party’s rights. Company Name reserves the right to remove
                any of Your Content from this Website at any time without
                notice.
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                5. No warranties
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                This Website is provided “as is,” with all faults, and Company
                Name express no representations or warranties, of any kind
                related to this Website or the materials contained on this
                Website. Also, nothing contained on this Website shall be
                interpreted as advising you.
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                6. Limitation of liability
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                In no event shall Company Name, nor any of its officers,
                directors and employees, shall be held liable for anything
                arising out of or in any way connected with your use of this
                Website whether such liability is under contract. Company Name,
                including its officers, directors and employees shall not be
                held liable for any indirect, consequential or special liability
                arising out of or in any way related to your use of this
                Website.
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                7. Indemnification
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                You hereby indemnify to the fullest extent Company Name from and
                against any and/or all liabilities, costs, demands, causes of
                action, damages and expenses arising in any way related to your
                breach of any of the provisions of these Terms.
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                8. Severability
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                If any provision of these Terms is found to be invalid under any
                applicable law, such provisions shall be deleted without
                affecting the remaining provisions herein.
              </Text>

              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                9. Variation of Terms
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Company Name is permitted to revise these Terms at any time as
                it sees fit, and by using this Website you are expected to
                review these Terms on a regular basis.
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setViewTerms(false)}
              style={{
                backgroundColor: "#4388CC",
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>SIGN UP</Text>

      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              lineHeight: 17.25,
              fontFamily: "ArialBold",
              color: "red",
              marginBottom: 10,
            }}
          >
            1
          </Text>
        </View>
        {isPhotoUploaded ? (
          <AntDesign name="checkcircle" size={24} color="green" />
        ) : (
          <>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                source={selectedImage ? { uri: selectedImage } : null}
                style={{
                  width: 135,
                  height: 135,
                  borderRadius: 67.5,
                  backgroundColor: "#D9D9D9",
                }}
              ></Image>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 12,
                fontSize: 15,
                fontWeight: "700",
                lineHeight: 17.25,
                fontFamily: "ArialBold",
                color: "#F31B1B",
              }}
            >
              Take a Selfie photo
            </Text>

            <Text
              style={{
                marginTop: 19,
                fontSize: 15,
                fontWeight: "700",
                lineHeight: 17.25,
                fontFamily: "ArialBold",
                color: "#2E8B57",
              }}
            >
              If this photo is ok upload it
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleUpload}
            >
              <Text style={styles.confirmButtonText}>UPLOAD</Text>
            </TouchableOpacity>
          </>
        )}
        <BR />
      </View>
      <View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            lineHeight: 17.25,
            fontFamily: "ArialBold",
            color: "red",
            width: "100%",
            textAlign: "center",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          2
        </Text>
      </View>

      {isNameSubmitted ? (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <AntDesign name="checkcircle" size={24} color="green" />
        </View>
      ) : (
        <>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: 20,
              justifyContent: "center",
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            <CustomInput
              label="FIRST NAME"
              value={firstName}
              onChange={(text) => {
                inputHandle("firstName", text);
              }}
            />
            <CustomInput
              label="LAST NAME"
              value={lastName}
              onChange={(text) => {
                inputHandle("lastName", text);
              }}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleSubmitName}
            >
              <Text style={styles.confirmButtonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <BR />
      {
        <View
          style={{
            width: "100%",
            alignItems: "center",
            // marginTop: 20,
            // marginBottom: 50,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                lineHeight: 17.25,
                fontFamily: "ArialBold",
                color: "red",
                width: "100%",
                textAlign: "center",
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              3
            </Text>
          </View>
          {isLocationSubmitted ? (
            <>
            <AntDesign name="checkcircle" size={24} color="green" />
            <Text
              style={{
                color: "#4388CC",
                fontSize: 15,
                margin: 10,
                fontWeight: "700",
                fontFamily: "ArialBold",
                textAlign: "center",
              }}
              >
                {city}, {country}
                {"\n"}
                latitude: {location?.latitude} {"  "}
                longitude: {location?.longitude}
              </Text>
            </>
             ) : (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handlePickLocation}
            >
              <Text
                style={{
                  color: "#F31B1B",
                  fontSize: 15,
                  margin: 10,
                  fontWeight: "700",
                  fontFamily: "ArialBold",
                }}
              >
                {location
                  ? "Lat : " +
                    location?.latitude +
                    ", " +
                    "Long : " +
                    location?.longitude
                  : "PICK CURRENT LOCATION"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      }
      <BR />
      <View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            lineHeight: 17.25,
            fontFamily: "ArialBold",
            color: "red",
            width: "100%",
            textAlign: "center",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          4
        </Text>
      </View>
      {
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#2E8B57" : undefined}
            />
            <Text
              style={{
                color: "#2E8B57",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              ACCEPT TERMS AND CONDITIONS
            </Text>
          </View>
          <TouchableOpacity onPress={() => setViewTerms(true)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                lineHeight: 17.25,
                color: "#4388CC",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              {"READ TERMS \n AND CONDITIONS"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleSubmitLocation}
          >
            <Text style={styles.finishButtonText1}>SUBMIT</Text>
            <Text style={styles.finishButtonText2}>FINISH</Text>
          </TouchableOpacity>
          <BR />
        </View>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", //"#FFCC33",
    // alignItems: "center",
    paddingTop: 32,
    // paddingLeft: 24,
    // paddingRight: 24,
    // fontFamily: 'ArialBold'
  },
  title: {
    fontSize: 16,
    lineHeight: 18.4,
    fontWeight: "700",
    fontFamily: "ArialBold",
    textAlign: "center",
    marginBottom: 50,
    justifyContent: "center",
    color: "#2E8B57",
    borderBottomColor: "#4388CC", // Add this to specify bottom border color
    borderBottomWidth: 3, // Add this to specify bottom border thickness
  },
  confirmButton: {
    borderColor: "#F31B1B",
    borderWidth: 3,
    backgroundColor: "#FFCC33",
    borderRadius: 34,
    marginTop: 19,
    alignItems: "center",
    width: 133,
    height: 53,
    justifyContent: "center",
  },
  locationButton: {
    borderColor: "#F31B1B",
    borderWidth: 3,
    backgroundColor: "#FFCC33",
    borderRadius: 34,
    marginTop: 19,
    alignItems: "center",
    // width: 133,
    // height: 53,
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#F31B1B",
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "ArialBold",
  },
  finishButton: {
    borderColor: "#F31B1B",
    borderWidth: 3,
    marginTop: 19,
    alignItems: "center",
    backgroundColor: "#FFCC33",
    width: 174,
    height: 90,
    justifyContent: "center",
  },
  finishButtonText1: {
    color: "#F31B1B",
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "ArialBold",
  },
  finishButtonText2: {
    color: "#2E8B57",
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "ArialBold",
  },
});

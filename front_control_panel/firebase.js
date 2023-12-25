import { initializeApp } from "firebase/app";
import { getFirestore, query, where, doc, updateDoc } from "firebase/firestore";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
//docs collection
import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbMUfEnD3JjZW3f6HcQkbye4TBaIHrpOE",
  authDomain: "socialapp-92e75.firebaseapp.com",
  projectId: "socialapp-92e75",
  storageBucket: "socialapp-92e75.appspot.com",
  messagingSenderId: "816502987751",
  appId: "1:816502987751:web:02acde8e2b2ebadc1c3b42",
  measurementId: "G-X1XE00CKP7",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const storage = getStorage(app);

export {
  auth,
  firestore,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  app,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  getDocs,
  storage,
  ref,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
  signInWithEmailAndPassword,
  query,
  where,
  doc,
  updateDoc,
};

import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../../firebase';
import { API_BASE } from "../config";

const API = axios.create({
  baseURL: API_BASE,
  withToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(async (config) => {
  if (config.withToken) {
    const token = await auth.currentUser.getIdToken(true);
    if (token) {
      config.headers.Authorization = token;
    }
  }

  return config;
});

export default API;

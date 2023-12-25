import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  currentUser: {},
};

export default function authReducer(state = initialState, action) {
  const temp = { ...state };
  switch (action.type) {
    case "setUser":
      temp.currentUser = action.data;
      return temp;
    default:
      return temp;
  }
}

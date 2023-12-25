import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.reducer";
import notificationReducer from "./notificationReducer";

const rootReducer = combineReducers({
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

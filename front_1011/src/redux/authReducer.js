import { createSlice } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";
import { clearMessage, setMessage } from "./notificationReducer";

// let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
let user = null;
let users = null;
export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    loggingIn: false,
    loggedIn: false,
    user,
    users,
    registering: false,
    token: null,
    verified: false,
    error: null,
  },
  reducers: {
    loginRequest: (state) => {
      state.loggingIn = true;
    },
    loginSuccess: (state, action) => {
      state.loggingIn = false;
      state.loggedIn = true;
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
    },
    loginFailure: (state) => {
      state.loggingIn = false;
      state.loggedIn = false;
    },
    registerRequest: (state) => {
      state.registering = true;
    },
    registerEnd: (state) => {
      state.registering = false;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.loggedIn = false;
    },
    verifyRequest: (state) => {
      state.verified = false;
    },
    verifySuccess: (state) => {
      state.verified = true;
    },
    verifyFailure: (state) => {
      state.verified = false;
    },
    resetPasswordRequest: (state) => {},
    changeUserSuccess: (state, action) => {
      console.log("user user user ", action.payload);
      state.user = action.payload.user;
    },
  },
});

const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerEnd,
  logout,
  verifyRequest,
  verifySuccess,
  verifyFailure,
  changeUserSuccess,
  resetPasswordRequest,
} = authSlice.actions;

export const registerUser = (user, navigateToVerify) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    await authService.registerUser(user);
    navigateToVerify();
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
    dispatch(registerEnd());
  }
};

export const loginUser = (data, navigateToHome) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const user = await authService.login(data);
    dispatch(loginSuccess(user));
    navigateToHome();
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
    // Dispatch failure action with error message
    dispatch(loginFailure());
  }
};

export const verify = (userData, navigateToNext) => async (dispatch) => {
  dispatch(verifyRequest());

  try {
    await authService.verify(userData);
    dispatch(verifySuccess());
    navigateToNext();
  } catch (error) {
    // show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
    // dispatch failure action with error message
    dispatch(verifyFailure());
  }
};

export const forgotPassword = (data, navigateToVerify) => async (dispatch) => {
  try {
    await authService.forgotPassword(data);
    navigateToVerify();
  } catch (error) {
    // show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
    // dispatch failure action with error message
    dispatch(verifyFailure());
  }
};
export const resetPassword = (pswds, navigateToLogin) => async (dispatch) => {
  try {
    await authService.resetPassword(pswds);
    if (navigateToLogin) navigateToLogin();
  } catch (error) {
    // show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
    // dispatch failure action with error message
    dispatch(verifyFailure());
  }
};
export const saveProfile = (userData, token) => async (dispatch) => {
  try {
    const user = await authService.saveProfile(userData, token);
    dispatch(changeUserSuccess(user))
    // show a toast notification
    dispatch(setMessage("Profile Updated Successfully"));
    dispatch(clearMessage());
  } catch (error) {
    // show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const changePassword = (accountData, token) => async (dispatch) => {
  try {
    await authService.changePassword(accountData, token);
    // show a toast notification
    dispatch(
      setMessage(
        `User password updated successfully. Current password is ${accountData.password}`
      )
    );
    dispatch(clearMessage());
  } catch (error) {
    // show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const changeNotify = (notify, type, token) => async (dispatch) => {
  try {
    const user = await authService.changeNotify(notify, type, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const addEducation = (education, token) => async (dispatch) => {
  try {
    const user = await authService.addEducation(education, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const editEducation = (education, token) => async (dispatch) => {
  try {
    const user = await authService.editEducation(education, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const deleteEducation = (edu_id, token) => async (dispatch) => {
  try {
    const user = await authService.deleteEducation(edu_id, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};
export const addExperience = (experience, token) => async (dispatch) => {
  try {
    const user = await authService.addExperience(experience, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const editExperience = (experience, token) => async (dispatch) => {
  try {
    const user = await authService.editExperience(experience, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const deleteExperience = (exp_id, token) => async (dispatch) => {
  try {
    const user = await authService.deleteExperience(exp_id, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};

export const addSkills = (skills, token) => async (dispatch) => {
  try {
    const user = await authService.addSkills(skills, token);
    dispatch(changeUserSuccess(user));
  } catch (error) {
    // Show a toast notification
    dispatch(setMessage(error.message));
    dispatch(clearMessage());
  }
};
export const logoutUser = () => async (dispatch) => {
  dispatch(logout());
};

export default authSlice.reducer;

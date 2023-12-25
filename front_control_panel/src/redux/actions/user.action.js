import API from "../API";
// import AsyncStorage from '@react-native-community/async-storage';


export function setUser(data) {
  return { type: "setUser", data };
}


export function updateprofile(data, navigate) {
  return async (dispatch) => {
    API.post("auth/updateprofile", data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((result) => {
        if (result.data.status === "success") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          dispatch(setUser(""));
          navigate("signIn");
        }
      })
      .catch((err) => {
        toast.show('Server Error', {
          duration: 5000,
          type: "warning",
          placement: "bottom",
        });
      });
  };
}

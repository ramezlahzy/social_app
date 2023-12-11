import { useSelector } from "react-redux";

export const authHeader = () => {
  // let user = JSON.parse(localStorage.getItem('user'));
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  if (user && token){
      return {
          'Authorization': 'Bearer ' + token,
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
      }
  } else {
      return {};
  }
}

export const handleResponse = async (response, onError) => {
  console.log('response1')
  const res = await response;
  console.log('response2')
  const text = await res.text();

  const data = text && JSON.parse(text);
  if (!res.ok){
      if (res.status === 401 && onError){
          onError();
      }

      const error = (data && data.message) || res.statusText;
      console.log(error);
      throw new Error(error);
  }

  return data;
}

import { authHeader, handleResponse } from "../util/handlers";
import { API_BASE } from "../config";


const verify = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    },
    body: JSON.stringify({email:data.email, code: data.value}),
  };

  const response = fetch(`${API_BASE}/auth/verify`, requestOptions);
  return await handleResponse(response);
};

export const authService = {
  verify,
};

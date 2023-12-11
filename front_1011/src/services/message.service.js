import { authHeader, handleResponse } from "../util/handlers";
import { API_BASE } from "../config";

const getMessageAggr = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          "Authorization": 'Bearer ' + token
        },
      }
      const response = fetch(`${API_BASE}/message/getMessageAggr`, requestOptions);
      return await handleResponse(response);
}

const getMessagesWithUser = async (toUserId, token) => {
    console.log("getting messages with user: toUserId, token; ", toUserId, token)
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          "Authorization": 'Bearer ' + token
        },
      }
      const response = fetch(`${API_BASE}/message/getMessagesWithUser/${toUserId}`, requestOptions);
      return await handleResponse(response);
}

const addMessage = async (data, token) => {
    console.log("Adding message, data nad token: ", data, token)
    const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          "Authorization": 'Bearer ' + token
        },
        body: JSON.stringify(data)
      }
      const response = fetch(`${API_BASE}/message/addMessage`, requestOptions);
      return await handleResponse(response);
}

const modifyMessage = async (data, token) => {
    const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          "Authorization": 'Bearer ' + token
        },
        body: JSON.stringify(data)
      }
      const response = fetch(`${API_BASE}/message/modifyMessage`, requestOptions);
      return await handleResponse(response);
}

const deleteMessage = async (messageId, token) => {
    const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          "Authorization": 'Bearer ' + token
        }
      }
      const response = fetch(`${API_BASE}/message/deleteMessage/${messageId}`, requestOptions);
      return await handleResponse(response);
}


// Test it
const deleteMessages = async (toUserId, token) => {
  const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
        "Authorization": 'Bearer ' + token
      }
    }
    const response = fetch(`${API_BASE}/message/deleteMessages/${toUserId}`, requestOptions);
    return await handleResponse(response);
}


export const messageService = {
    getMessageAggr,
    getMessagesWithUser,
    addMessage,
    modifyMessage,
    deleteMessage,
    deleteMessages,
}

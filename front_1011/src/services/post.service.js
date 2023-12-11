import { authHeader, handleResponse } from "../util/handlers";
import Axios from 'axios'
import { API_BASE } from "../config";

const getMyPosts = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          "Authorization": 'Bearer ' + token
        },
      }
      const response = fetch(`${API_BASE}/post/getPostsByMe`, requestOptions);
      return await handleResponse(response);
}

const getPostsById = async (userid, token) => {
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
          "Authorization": 'Bearer ' + token
        },
      }
      const response = fetch(`${API_BASE}/post/getPostsById/${userid}`, requestOptions);
      return await handleResponse(response);
}

const addMyPost = async(data, token) => {
    const response = await Axios.put(`${API_BASE}/user/saveProfile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": 'Bearer ' + token
        },
    });
    return await handleResponse(response);
}

const modifyPost = async(data, token) => {
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
      const response = fetch(`${API_BASE}/post/modifyPost`, requestOptions);
      return await handleResponse(response);
}

const deletePost = async(postId, token) => {
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
      const response = fetch(`${API_BASE}/post/deletePost/${postId}`, requestOptions);
      return await handleResponse(response);
}


export const postService = {
    getMyPosts,
    getPostsById,
    addMyPost,
    modifyPost,
    deletePost
}
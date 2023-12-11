import { authHeader, handleResponse } from "../util/handlers";

import { API_BASE } from "../config";

const getUsers = async (term, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Authorization": 'Bearer ' + token
    },
  }
  const response = fetch(`${API_BASE}/user/getUsersByTerm?term=${term}`, requestOptions);
  return await handleResponse(response);
}

const getUserById = async (id, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Authorization": 'Bearer ' + token
    },
  }
  const response = fetch(`${API_BASE}/user/getUserByid/${id}`, requestOptions);
  return await handleResponse(response);
}

const getFollowings = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Authorization": 'Bearer ' + token
    },
  }
  const response = fetch(`${API_BASE}/user/getFollowListToMe`, requestOptions);
  return await handleResponse(response);
}

const getFollowers = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Authorization": 'Bearer ' + token
    },
  }
  const response = fetch(`${API_BASE}/user/getFollowListFromMe`, requestOptions);
  return await handleResponse(response);
}

const setFollow = async (id, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Authorization": 'Bearer ' + token
    },
    body:JSON.stringify({followId:id}),
  }
  const response = fetch(`${API_BASE}/user/setFollow`, requestOptions);
  return await handleResponse(response);
}

const setUnfollow = async (id, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      "Authorization": 'Bearer ' + token
    },
    body:JSON.stringify({unFollowId:id}),
  }
  const response = fetch(`${API_BASE}/user/setUnFollow`, requestOptions);
  return await handleResponse(response);
}

export const usersService = {
  getUsers,
  getUserById,
  getFollowings,
  getFollowers,
  setFollow,
  setUnfollow,
};

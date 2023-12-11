const DEV_MODE = true;
export const API_BASE =
  DEV_MODE === true ? "http://192.168.8.102:3000/" : "";

export const SOCKET_BASE =
  DEV_MODE === true ? "http://192.168.8.102:3000" : "";

export const IMG_URL =
  DEV_MODE === true ? "http://192.168.8.102:3000/images/" : "";

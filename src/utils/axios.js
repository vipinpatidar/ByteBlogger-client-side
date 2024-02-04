import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_HOST_UR}/api/`;

axios.defaults.withCredentials = true;

export const makeRequest = axios.create({
  baseURL: BASE_URL,
});

/*
export const makeUserRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
*/

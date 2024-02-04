import axios from "axios";

const BASE_URL = "http://localhost:3000/api/";

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

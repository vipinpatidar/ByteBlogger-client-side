import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_HOST_URL}/api/`;

axios.defaults.withCredentials = true;

// Create a function to retrieve the token from sessionStorage
const getToken = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user).token : null;
};

// Create a function to make requests with the Authorization header
export const token = () => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if a token is available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const makeRequest = axios.create({
  baseURL: BASE_URL,
  headers: token(),
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

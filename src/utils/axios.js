import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_HOST_URL}/api/`;

axios.defaults.withCredentials = true;

// Create a function to retrieve the token from sessionStorage
const getToken = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user).token : null;
};

// Create a function to make requests with the Authorization header
/*
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
*/

export const makeRequest = axios.create({
  baseURL: BASE_URL,
  // headers: token(),
  withCredentials: true,
});

makeRequest.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/*
// new
[
  {
    white: "#101524",
    black: "#f2ddcc",
    grey: "#343a4d",
    gray: "#343a4d",
    "dark-grey": "#646b88",
    red: "#FF4E4E",
    transparent: "transparent",
    twitter: "#0E71AB",
    purple: "#582CBE",
  },
];

// old
[
  {
    white: "#242424",
    black: "#F3F3F3",
    grey: "#2A2A2A",
    gray: "#2a2a2a",
    "dark-grey": "#E7E7E7",
    red: "#FF4E4E",
    transparent: "transparent",
    twitter: "#0E71AB",
    purple: "#582CBE",
  },
];
*/

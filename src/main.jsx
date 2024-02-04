import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/user.context.jsx";
import ColorThemeContextProvider from "./context/colorTheme.context.jsx";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log(error);
      if (query?.state?.data === undefined) {
        const err =
          error?.response?.data.error || "Opps! Something went wrong.";
        toast.error(err);
      }
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ColorThemeContextProvider>
      <UserContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </UserContextProvider>
    </ColorThemeContextProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

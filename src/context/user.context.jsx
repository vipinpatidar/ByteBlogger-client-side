import { createContext, useEffect, useState } from "react";
import { getFromSession } from "../common/session";

export const UserContext = createContext({
  userAuth: {},
  setUserAuth: () => {},
});

const UserContextProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState({ isAuthenticated: false });

  useEffect(() => {
    let userInSession = JSON.parse(getFromSession("user"));

    if (userInSession) {
      setUserAuth({
        isAuthenticated: true,
        ...userInSession,
      });
    } else {
      setUserAuth({ isAuthenticated: false });
    }
  }, []);

  // console.log(userAuth, "context");

  const context = {
    userAuth,
    setUserAuth,
  };
  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;

import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/user.context";

const RequireAuth = ({ children }) => {
  const { userAuth } = useContext(UserContext);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once user authentication status is determined
    // console.log("in");
    setIsLoading(false);
  }, [userAuth]);
  // console.log("out");

  // If still loading, return null or a loading indicator
  if (isLoading) {
    return null; // or a loading indicator if you prefer
  }
  // console.log("down");
  /*
out
in
out
down
so useEffect stopped code for some time in that time we got authentication status.
The component starts with isLoading set to true.
The useEffect with the dependency on userAuth updates isLoading to false once the authentication status is determined.
While isLoading is true, the component returns null (or a loading indicator).
Once isLoading is false, the component checks the authentication status and either redirects to the login page or renders the children.
*/

  // Check if user is authenticated
  if (!userAuth?.email) {
    // Use Navigate to redirect to the login page
    return (
      <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    );
  }
  if (!userAuth?.isEditor) {
    return <Navigate to={"/error404"} />;
  }
  // If user is authenticated, render the children
  return children;
};

export default RequireAuth;

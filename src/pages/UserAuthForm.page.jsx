import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { makeRequest } from "../utils/axios";
import { storeInSession } from "../common/session";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/user.context";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  // const authForm = useRef();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setUserAuth } = useContext(UserContext);
  const [guestValue, setGuestValue] = useState({
    email: "",
    password: "",
  });

  const userAuthThroughServer = async (serverRoute, formData) => {
    try {
      const res = await makeRequest.post(serverRoute, formData);

      // console.log(res?.data);

      if (res?.data) {
        storeInSession("user", JSON.stringify(res.data));
        setUserAuth({ isAuthenticated: true, ...res?.data });
        navigate(state?.path || "/", { replace: true });
      }
    } catch (error) {
      const err = error?.response?.data?.error || "Something went wrong.";
      console.log(err);
      toast.error(err);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    let serverRoute = type === "login" ? "login" : "signup";

    try {
      // console.log(authForm.current);
      let form = new FormData(authForm);
      let formData = {};

      for (let [key, value] of form.entries()) {
        // console.log(key, value);
        formData[key] = value;
      }

      userAuthThroughServer(`/auth/${serverRoute}`, formData);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error! Try again.");
    }
  };

  /*==================== GOOGLE AUTH ===================== */

  const googleAuthHandler = async (e) => {
    e.preventDefault();
    try {
      const user = await authWithGoogle();
      // console.log(user);

      let serverRoute = "googleAuth";
      let formData = {
        access_token: user.accessToken,
      };

      userAuthThroughServer(serverRoute, formData);
    } catch (error) {
      toast.error(
        error.message ||
          "Google login failed. Try again later or use other method for login."
      );
    }
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="authForm" className="w-[80%] max-w-[400px]">
          <h1
            className={`text-4xl font-gelasio capitalize text-center ${
              type === "login" ? "mb-20" : "mb-16"
            }`}
          >
            {type === "login" ? "Welcome back" : "Join us today"}
          </h1>
          {type === "signup" ? (
            <InputBox
              type="text"
              name="fullName"
              placeholder={"Enter Your Full Name"}
              iconName={"fi-rr-user"}
            />
          ) : (
            ""
          )}
          {type === "signup" ? (
            <InputBox
              type="text"
              name="username"
              placeholder={"Enter Your Unique Username"}
              iconName={"fi-rr-id-card-clip-alt"}
            />
          ) : (
            ""
          )}
          <InputBox
            type="email"
            name="email"
            placeholder={"Enter Your Email"}
            iconName={"fi-rr-envelope"}
            value={guestValue.email !== "" ? guestValue.email : ""}
          />
          <InputBox
            type="password"
            name="password"
            placeholder={"Enter Your Secret Password"}
            iconName={"fi-rr-key"}
            value={guestValue.password !== "" ? guestValue.password : ""}
          />
          <button
            className="btn-dark center mt-10"
            type="submit"
            onClick={submitHandler}
          >
            {type === "signup" ? "Sign Up" : "Login"}
          </button>
          {type === "login" && (
            <div
              className="text-center mt-8 text-blue-500 text-xl underline cursor-pointer"
              onClick={() =>
                setGuestValue({
                  email: "guest@gmail.com",
                  password: "Guest123",
                })
              }
            >
              Login As Guest Editor
            </div>
          )}
          <div className="relative w-full flex items-center gap-2 mt-6 mb-4 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>Or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            type="button"
            className="btn-dark flex items-center justify-center gap-3 center w-[90%]"
            onClick={googleAuthHandler}
          >
            <img src={googleIcon} alt="google icon" className="w-6" />
            Continue with Google
          </button>
          {type === "login" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link
                to={"/signup"}
                className="underline text-black text-xl ml-2"
                onClick={() =>
                  setGuestValue({
                    email: "",
                    password: "",
                  })
                }
              >
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center ">
              Already a member?
              <Link to={"/login"} className="underline text-black text-xl ml-2">
                Login here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;

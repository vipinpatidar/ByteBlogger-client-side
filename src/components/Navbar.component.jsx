import React, { useState, useContext, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { Toaster } from "react-hot-toast";
import UserNavigationPanel from "./user-navigation.component";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import { ColorThemeState } from "../context/colorTheme.context";
import { storeInSession } from "../common/session";
import logoDark from "../imgs/readerLogo.png";
import logoLight from "../imgs/readerLightLogo.png";

const Navbar = () => {
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const {
    userAuth,
    userAuth: { profile_img, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);
  const navigate = useNavigate();

  const { theme, setTheme } = ColorThemeState();

  const location = useLocation();

  let isEditorWithBlogData =
    location.pathname.includes("/editor") &&
    location.pathname.includes("4v8i0p");

  // console.log(isEditorWithBlogData);

  // console.log(userAuth);

  const isBackendProfileImg =
    typeof profile_img === "string" && profile_img.includes("/uploads");

  const handleBlur = () => {
    setTimeout(() => {
      setIsNavVisible(false);
    }, 200);
  };

  const searchQueryHandler = (e) => {
    let query = e.target.value;

    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
      setIsSearchBoxVisible(false);
      e.target.value = "";
    }
  };

  /*================== CHECK IF NOTIFICATION ==================== */

  const { data, isLoading, error } = useQuery({
    queryKey: ["isNotification"],
    queryFn: async () => {
      const res = await makeRequest.get("/notification/isNotification");
      return res.data;
    },
    enabled: !!userAuth.email,
  });

  // console.log(new_notification_available);

  // console.log(data);

  useEffect(() => {
    if (!error && !isLoading && data) {
      setUserAuth((prevState) => ({
        ...prevState,
        ...data,
      }));
    }
  }, [data, isLoading]);

  return (
    <>
      <nav className="navbar z-50">
        <Toaster />
        <Link to={"/"} className="flex-none w-[50px]">
          <img
            src={theme === "light" ? logoDark : logoLight}
            alt="logo"
            className="w-full"
          />
        </Link>
        <div
          className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
            isSearchBoxVisible ? "show" : "hide"
          }`}
        >
          <input
            type="search"
            placeholder="Search..."
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={searchQueryHandler}
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>
        <div className="flex item-center gap-3 md:gap-6 ml-auto">
          <button
            className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10"
            onClick={() => {
              setTheme((prevState) =>
                prevState === "light" ? "dark" : "light"
              );

              storeInSession("theme", theme === "light" ? "dark" : "light");
            }}
          >
            <i
              className={`fi ${
                theme === "light" ? "fi-rr-moon-stars" : "fi-rr-brightness"
              } text-2xl block mt-2`}
            ></i>
          </button>

          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setIsSearchBoxVisible((currState) => !currState)}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>

          {userAuth?.isEditor && !isEditorWithBlogData && (
            <Link to={"/editor"} className="hidden md:flex gap-2 link">
              <i className="fi fi-rr-file-edit"></i>
              <p>Write</p>
            </Link>
          )}

          {!userAuth?.isEditor && userAuth?.email && (
            <Link to={`/becomeEditor`} className="hidden md:flex gap-2 link">
              <i className="fi fi-rr-text"></i>
              <p>Become Editor</p>
            </Link>
          )}

          {userAuth?.email ? (
            <>
              <Link to={"/dashboard/notifications"}>
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block mt-2"></i>

                  {new_notification_available && (
                    <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                  )}
                </button>
              </Link>
              <button
                className="relative"
                onClick={() => setIsNavVisible((prevState) => !prevState)}
                onBlur={handleBlur}
              >
                <div className="w-12 h-12  border border-grey rounded-full overflow-hidden cursor-pointer">
                  <img
                    src={
                      isBackendProfileImg
                        ? import.meta.env.VITE_HOST_URL + profile_img
                        : userAuth?.profile_img
                    }
                    alt="profile image"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {isNavVisible && (
                  <UserNavigationPanel
                    isEditorWithBlogData={isEditorWithBlogData}
                  />
                )}
              </button>
            </>
          ) : (
            <>
              <Link to={"/login"} className="btn-dark py-2">
                Sign In
              </Link>
              <Link to={"/signup"} className="btn-light py-2 hidden md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;

import React, { useEffect, useRef, useState, useContext } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/user.context";

const SideNavbar = () => {
  const location = useLocation();
  let pageLocation = location.pathname.split("/")[2];
  const [pageState, setPageState] = useState(pageLocation.replace("-", " "));
  const [showHideSideNav, setShowHideSideNav] = useState(false);
  const { userAuth } = useContext(UserContext);

  const activeTabLine = useRef();
  const sideBarIconTab = useRef();
  const pageStateTab = useRef();

  const changePageStateHandler = (e) => {
    let { offsetWidth, offsetLeft } = e.target;
    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    if (e.target === sideBarIconTab.current) {
      setShowHideSideNav((prevState) => !prevState);
    } else {
      setShowHideSideNav(false);
    }
  };

  useEffect(() => {
    pageStateTab.current.click();
    setShowHideSideNav(false);
  }, [pageState]);

  return (
    <>
      <section className="flex relative gap-10 py-0 m-0 max-md:flex-col">
        <div className="sticky top-[79px] z-30 sideNav">
          <div className="md:hidden bg-white py-1 border-b border-gray flex flex-nowrap overflow-x-auto ">
            <button
              className="p-5 capitalize"
              ref={sideBarIconTab}
              onClick={changePageStateHandler}
            >
              <i className="fi fi-rr-bars-staggered pointer-events-none text-xl"></i>
            </button>
            <button
              className="p-5 capitalize"
              ref={pageStateTab}
              onClick={changePageStateHandler}
            >
              {pageState}
            </button>
            <hr
              className="absolute z-30 bottom-0 duration-50"
              ref={activeTabLine}
            />
          </div>
          <div
            className={`min-w-[240px] h-[calc(600px)] md:h-cover md:sticky top-24 overflow-y-auto scrollbar p-6 pr-0 border-gray border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100% + 80px)] px-16 max-md:-ml-7 duration-500 ${
              !showHideSideNav
                ? "max-md:opacity-0 max-md:pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
          >
            {userAuth?.isAdmin && (
              <div>
                <h1 className="text-xl text-dark-grey mb-2">Admin Dashboard</h1>
                <hr className="border-gray -ml-6 mb-3 mr-6" />
                <NavLink
                  to={"/adminDashboard/editors?isAdmin=true"}
                  onClick={(e) => {
                    setPageState(e.target.innerText);
                    setShowHideSideNav(false);
                  }}
                  className="sidebar-link"
                >
                  <i className="fi fi-rr-user-pen"></i>
                  Editors
                </NavLink>

                <NavLink
                  to={"/adminDashboard/editors-blogs?isAdmin=true"}
                  onClick={(e) => {
                    setPageState(e.target.innerText);
                    setShowHideSideNav(false);
                  }}
                  className="sidebar-link"
                >
                  <i className="fi fi-rr-document"></i>
                  Editors Blogs
                </NavLink>

                <NavLink
                  to={"/adminDashboard/editor-activity?editor=true"}
                  onClick={(e) => {
                    setPageState(e.target.innerText);
                    setShowHideSideNav(false);
                  }}
                  className="sidebar-link relative mb-8"
                >
                  <i className="fi fi-rr-bell"></i>
                  {userAuth.new_notification_available && (
                    <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-5 left-2"></span>
                  )}
                  Editors Activity
                </NavLink>
              </div>
            )}

            <div>
              <h1 className="text-xl text-dark-grey  mb-2">Notifying</h1>
              <hr className="border-gray -ml-6 mb-3 mr-6" />
              <NavLink
                to={"/message/notifying"}
                onClick={(e) => {
                  setPageState(e.target.innerText);
                  setShowHideSideNav(false);
                }}
                className="sidebar-link mb-8"
              >
                <i className="fi fi-rr-envelope-dot"></i>
                {!userAuth.isAdmin ? "Notify To Admin" : "Notify To Editor"}
              </NavLink>
            </div>

            <div>
              <h1 className="text-xl text-dark-grey mb-2">
                {" "}
                {userAuth.isEditor ? "Blogs Dashboard" : "Notification"}
              </h1>
              <hr className="border-gray -ml-6 mb-3 mr-6" />
              {userAuth?.isEditor && (
                <>
                  <NavLink
                    to={"/editor"}
                    onClick={(e) => {
                      setPageState(e.target.innerText);
                      setShowHideSideNav(false);
                    }}
                    className="sidebar-link"
                  >
                    <i className="fi fi-rr-file-edit"></i>
                    Write
                  </NavLink>
                  <NavLink
                    to={"/dashboard/blogs"}
                    onClick={(e) => {
                      setPageState(e.target.innerText);
                      setShowHideSideNav(false);
                    }}
                    className="sidebar-link"
                  >
                    <i className="fi fi-rr-document"></i>
                    Blogs
                  </NavLink>
                </>
              )}
              <NavLink
                to={"/dashboard/notifications"}
                onClick={(e) => {
                  setPageState(e.target.innerText);
                  setShowHideSideNav(false);
                }}
                className="sidebar-link relative"
              >
                <i className="fi fi-rr-bell"></i>
                {userAuth.new_notification_available && (
                  <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-5 left-2"></span>
                )}
                Notifications
              </NavLink>
            </div>

            {/* Favorites */}

            <div>
              <h1 className="text-xl text-dark-grey mt-6"> Favorites</h1>
              <hr className="border-gray -ml-6 mb-3 mr-6" />
              {userAuth?.email && (
                <>
                  <NavLink
                    to={"/favorites/liked-blogs"}
                    onClick={(e) => {
                      setPageState(e.target.innerText);
                      setShowHideSideNav(false);
                    }}
                    className="sidebar-link"
                  >
                    <i className="fi fi-rs-heart"></i>
                    Liked Blogs
                  </NavLink>

                  <NavLink
                    to={"/favorites/read-later"}
                    onClick={(e) => {
                      setPageState(e.target.innerText);
                      setShowHideSideNav(false);
                    }}
                    className="sidebar-link"
                  >
                    <i className="fi fi-rr-bookmark"></i>
                    Saved Blogs
                  </NavLink>
                </>
              )}
            </div>

            <h1 className="text-xl text-dark-grey mb-2 mt-6">Settings</h1>
            <hr className="border-gray -ml-6 mb-3 mr-6" />
            <NavLink
              to={"/settings/edit-profile"}
              onClick={(e) => {
                setPageState(e.target.innerText);
                setShowHideSideNav(false);
              }}
              className="sidebar-link"
            >
              <i className="fi fi-rr-user"></i>
              Edit Profile
            </NavLink>
            <NavLink
              to={"/settings/change-password"}
              onClick={(e) => {
                setPageState(e.target.innerText);
                setShowHideSideNav(false);
              }}
              className="sidebar-link"
            >
              <i className="fi fi-rr-lock"></i>
              change Password
            </NavLink>
          </div>
        </div>
        <div className="max-md:-mt-8 mt-5 w-full">
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default SideNavbar;

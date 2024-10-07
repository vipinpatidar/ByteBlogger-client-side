import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { clearSession } from "../common/session";
import { makeRequest } from "../utils/axios";
import { toast } from "react-hot-toast";

const UserNavigationPanel = ({ isEditorWithBlogData }) => {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await makeRequest.post("/auth/logout");
      console.log(res?.data);
      clearSession();
      setUserAuth({ isAuthenticated: false });
      navigate("/");
    } catch (error) {
      const err = error?.response?.data?.error || "Something went wrong.";
      console.log(error);
      toast.error(err);
    }
  };

  return (
    <AnimationWrapper
      transition={{ duration: 0.3 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white border border-gray w-52 overflow-hidden duration-200 text-center shadow-sm">
        <Link
          to={"/"}
          className="flex gap-2 justify-center py-3 border-b border-gray link "
        >
          <i className="fi fi-rr-house-chimney"></i>
          <p>Home</p>
        </Link>
        {userAuth?.isEditor && !isEditorWithBlogData && (
          <Link
            to={"/editor"}
            className="flex gap-2 justify-center py-3 border-b border-gray link md:hidden"
          >
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>
        )}
        <Link
          to={`/users/${userAuth?.username}`}
          className="flex gap-2 justify-center py-3 border-b border-gray link"
        >
          <i className="fi fi-rr-user"></i>
          <p>Profile</p>
        </Link>
        {!userAuth?.isEditor && (
          <Link
            to={`/becomeEditor`}
            className="flex gap-2 justify-center py-3 border-b border-gray link  md:hidden"
          >
            <i className="fi fi-rr-text"></i>
            <p>Become Editor</p>
          </Link>
        )}

        {userAuth?.isAdmin && (
          <Link
            to={"/adminDashboard/editors?isAdmin=true"}
            className="flex gap-2 justify-center py-3 border-b border-gray link"
          >
            <i className="fi fi-rr-user-gear"></i>
            <p>Admin Dashboard</p>
          </Link>
        )}
        {/* {userAuth?.isEditor && (
        )} */}
        <Link
          to={
            userAuth.isEditor ? `/dashboard/blogs` : `/dashboard/notifications`
          }
          className="flex gap-2 justify-center py-3 border-b border-gray link"
        >
          <i
            className={
              userAuth.isEditor ? "fi fi-rr-dashboard" : "fi fi-rr-bell"
            }
          ></i>

          <p>{userAuth.isEditor ? "Dashboard" : "Notifications"}</p>
        </Link>
        <Link
          to={`/message/notifying`}
          className="flex gap-2 justify-center py-3 border-b border-gray link"
        >
          <i className="fi fi-rr-envelope-dot"></i>
          <p>Notifying</p>
        </Link>
        <Link
          to={`/settings/edit-profile`}
          className="flex gap-2 justify-center border-b border-gray py-3 link"
        >
          <i className="fi fi-rr-settings"></i>
          <p>Setting</p>
        </Link>
        {/* <span className="absolute border-t border-gray w-[100%]"></span> */}
        <div
          className="hover:bg-grey w-full flex gap-2 justify-center items-center py-3 text-center"
          onClick={logoutHandler}
        >
          <i className="fi fi-bs-exit text-black/60"></i>
          <h1 className=" text-black/60 font-medium mb-1">Logout</h1>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;

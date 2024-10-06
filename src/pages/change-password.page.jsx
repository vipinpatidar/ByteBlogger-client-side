import React, { useContext, useRef, useState } from "react";
import InputBox from "../components/Input.component";
import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";
import { makeRequest } from "../utils/axios";
import { UserContext } from "../context/user.context";

const ChangePassword = () => {
  const changePasswordRef = useRef();

  const { userAuth } = useContext(UserContext);

  const changePasswordSubmitHandler = async (e) => {
    e.preventDefault();

    //!temporary code for guest users
    if (userAuth.fullName.includes("guest")) {
      toast.error("You are not allow to change password");
      return;
    }

    try {
      let form = new FormData(changePasswordRef.current);
      let formData = {};
      let passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

      for (let [key, value] of form.entries()) {
        formData[key] = value;
      }

      // Verify password

      if (!formData.currentPassword.length) {
        toast.error("Please enter your current password.");
        return;
      }
      if (!formData.newPassword.length) {
        toast.error("Please enter your new password.");
        return;
      }
      if (
        !passwordRegExp.test(formData.currentPassword) ||
        !passwordRegExp.test(formData.newPassword)
      ) {
        return toast.error(
          "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter."
        );
      }

      const res = await makeRequest.post("/auth/change-password", formData);

      if (res?.data) {
        toast.success(res?.data);
        changePasswordRef.current.reset();
      }
    } catch (error) {
      console.log(error);
      const err = error?.response?.data?.error || "Something went wrong.";
      toast.error(err);
    }
  };

  return (
    <AnimationWrapper>
      <Toaster />
      <form
        className="py-12 mt-12 md:mt-0 max-w-[400px] center"
        onSubmit={changePasswordSubmitHandler}
        ref={changePasswordRef}
      >
        <h1 className="max-md:hidden my-10 text-2xl font-medium">
          Change Password
        </h1>
        <div className="w-full ">
          <InputBox
            name={"currentPassword"}
            type={"password"}
            className="profile-edit-input"
            placeholder="Enter Current Password"
            iconName={"fi-rr-unlock"}
          />
          <InputBox
            name={"newPassword"}
            type={"password"}
            className="profile-edit-input"
            placeholder="Enter New Password"
            iconName={"fi-rr-unlock"}
          />

          <button className="btn-dark px-8 center mt-8" type="submit">
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;

import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  const {
    personal_info: { fullName, username, profile_img },
  } = user;

  const isBackendProfileImg =
    typeof profile_img === "string" && profile_img.includes("/uploads");

  return (
    <Link to={`/users/${username}`} className="flex gap-5 items-center mb-5">
      <img
        src={
          isBackendProfileImg
            ? import.meta.env.VITE_HOST_URL + profile_img
            : profile_img
        }
        alt="profile"
        className="w-14 h-14 rounded-full border border-grey"
      />
      <div>
        <h1 className="font-medium text-xl line-clamp-2 capitalize">
          {fullName}
        </h1>
        <p className="text-dark-grey">@{username}</p>
      </div>
    </Link>
  );
};

export default UserCard;

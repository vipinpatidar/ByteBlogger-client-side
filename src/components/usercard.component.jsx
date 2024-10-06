import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  const {
    personal_info: { fullName, username, profile_img },
  } = user;

  return (
    <Link to={`/users/${username}`} className="flex gap-3 items-center mb-5">
      <img
        src={profile_img}
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

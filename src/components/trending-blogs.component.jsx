import React from "react";
import { Link } from "react-router-dom";
import { getTimeFormate } from "../common/date";

const TrendingBlogPost = ({ index, blog, author }) => {
  const { title, _id: blogId, publishedAt } = blog;
  const { fullName, username, profile_img } = author;

  return (
    <Link
      to={`/blogs/${title
        .replace(/[?/|&]/g, "")
        .split(" ")
        .join("-")}-4v8i0p${blogId}`}
      className="flex gap-5 mb-8"
    >
      <h2 className="blog-index">{index < 10 ? `0${index + 1}` : index}</h2>

      <div>
        <div className="flex gap-2 items-center mb-3 ">
          <img
            src={profile_img}
            alt="profile image"
            className="w-[25px] h-[25px] rounded-full border border-grey"
          />
          <p className="line-clamp-1 capitalize flex items-center gap-2">
            {fullName.split(" ")[0]}
            <span className="normal-case">@{username}</span>
          </p>
          <p className="min-w-fit capitalize text-dark-grey">
            {getTimeFormate(publishedAt)}
          </p>
        </div>
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default TrendingBlogPost;

import React from "react";
import { getTimeFormate } from "../common/date";
import { Link } from "react-router-dom";

const BlogPostCard = ({ blog, author }) => {
  const {
    title,
    tags,
    des,
    banner,
    publishedAt,
    activity: { total_likes, total_comments },
    _id: blogId,
  } = blog;

  const { fullName, profile_img, username, email } = author;

  //   console.log(fullName, profile_img, username, email);
  // console.log(`${title.split(" ").join("-")}-4v8i0p${blogId}`);

  // const Id = title.remove("?").split(" ").join("-");

  return (
    <Link
      to={`/blogs/${title
        .replace(/[?/|&]/g, "")
        .split(" ")
        .join("-")}-4v8i0p${blogId}`}
      className="w-full mb-4 py-4 border-b gap-2 md:gap-6 border-grey flex items-center"
    >
      <div className="w-full  mb-4">
        <div className="flex gap-2 items-center mb-6 ">
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
        <h1 className="blog-title font-gelasio">{title}</h1>
        <p className="my-3 text-xl font-inter leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>
        <div className="flex items-center flex-wrap gap-3 mt-6">
          {tags.slice(0, 1).map((tag) => (
            <span className="btn-light py-2" key={tag}>
              {tag}
            </span>
          ))}
          <span className="flex items-center gap-2 text-dark-grey ml-3 md:ml-4 text-xl">
            <i className="fi fi-rr-heart h-6 mt-0 text-xl"></i>
            {total_likes}
          </span>
          <span className="flex items-center gap-2 text-dark-grey ml-3 md:ml-4 text-xl">
            <i className="fi fi-rs-comment-dots h-6 mt-0 text-xl"></i>
            {total_comments}
          </span>
        </div>
      </div>
      {/* image */}
      <div className="h-[6.5rem] md:h-28 aspect-square bg-grey">
        <img
          src={`${banner}`}
          alt="blog banner image"
          className="w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;

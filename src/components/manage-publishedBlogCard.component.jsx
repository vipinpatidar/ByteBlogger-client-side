import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getFullDayFormate } from "../common/date";
import BlogStats from "./blogStats.components";
import { UserContext } from "../context/user.context";

const ManagePublishedBlogCard = ({ blog, mutate, isAdmin = undefined }) => {
  let [showStat, setShowStat] = useState(false);
  const {
    title,
    banner,
    _id: blogId,
    publishedAt,
    activity,
    author: {
      personal_info: { username, fullName, profile_img },
    },
  } = blog;
  const { userAuth } = useContext(UserContext);

  const deleteBlogHandler = () => {
    mutate({
      blogId: blogId,
    });
  };

  return (
    <div className="border-b mb-6 max-md:px-4 border-grey pb-6">
      <div className="flex gap-10  items-center">
        <img
          src={banner}
          alt="blog image"
          className="w-32 h-32 flex-none bg-grey object-cover hidden md:block"
        />
        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link
              to={`/blogs/${title
                .replace(/[?/|&]/g, "")
                .split(" ")
                .join("-")}-4v8i0p${blogId}`}
              className="blog-title mb-3 hover:underline"
            >
              {title}
            </Link>

            {isAdmin === "true" && (
              <div className="font-medium text-xl text-dark-grey mb-2 flex items-center">
                <img
                  src={profile_img}
                  className="w-6 h-6 rounded-full flex-none mr-2"
                  alt="user image"
                />
                <span className="inline-block capitalize">
                  {fullName.split(" ")[0]}
                </span>
                <Link
                  to={`/users/${username}`}
                  className="text-black mx-2 underline"
                >
                  @{username}
                </Link>
              </div>
            )}
            <p className="text-dark-grey">
              Published at {getFullDayFormate(publishedAt)}
            </p>
          </div>

          <div className="flex gap-6 mt-2">
            <Link
              to={`/editor/${title
                .replace(/[?/|&]/g, "")
                .split(" ")
                .join("-")}-4v8i0p${blogId}`}
              state={{
                link:
                  isAdmin === "true"
                    ? "/adminDashboard/editors-blogs?isAdmin=true"
                    : "/dashboard/blogs",
              }}
              className="underline hover:text-purple flex items-center gap-1 pr-4 py-2 "
            >
              <i className="fi fi-rr-file-edit mt-0 block"> Edit</i>
            </Link>
            <button
              className="lg:hidden pr-4 py-2 underline text-twitter"
              onClick={() => setShowStat((prevState) => !prevState)}
            >
              Stats
            </button>
            {userAuth?.isAdmin && (
              <button
                className="pr-4 py-2 underline text-red"
                onClick={deleteBlogHandler}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>
      {showStat && (
        <div className="lg:hidden">
          <BlogStats stats={activity} />
        </div>
      )}
    </div>
  );
};

export default ManagePublishedBlogCard;

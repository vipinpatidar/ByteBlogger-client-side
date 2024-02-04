import React, { useContext } from "react";
import { Link } from "react-router-dom";

const ManageDraftBlogCard = ({ blog, index, mutate, isAdmin = undefined }) => {
  const {
    title,
    banner,
    _id: blogId,
    publishedAt,
    activity,
    des,
    author: {
      personal_info: { username, fullName, profile_img },
    },
  } = blog;

  const isBackendProfileImg =
    typeof profile_img === "string" && profile_img.includes("/uploads");

  const deleteDraftHandler = () => {
    mutate({
      blogId: blogId,
    });
  };

  return (
    <div className="flex gap-5 lg:gap10 pb-6 border-b mb-6 border-grey">
      <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
        {index < 10 ? `0${index}` : index}
      </h1>
      <img
        src={import.meta.env.VITE_HOST_URL + banner}
        alt="blog image"
        className="w-32 h-32 flex-none bg-grey object-cover hidden md:block"
      />
      <div>
        <h1 className="blog-title mb-2">{title}</h1>

        {isAdmin === "true" && (
          <div className="font-medium text-xl text-dark-grey mb-3 mt-3 flex items-center">
            <img
              src={
                isBackendProfileImg
                  ? import.meta.env.VITE_HOST_URL + profile_img
                  : profile_img
              }
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

        <p className="line-clamp-2 font-gelasio">
          {des.length ? des : "No description."}
        </p>
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
            className="pr-4 py-2 underline text-red"
            onClick={deleteDraftHandler}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageDraftBlogCard;

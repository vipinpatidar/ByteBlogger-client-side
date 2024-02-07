import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getFullDayFormate } from "../common/date";
import CommentField from "./comment-field.component";
import { UserContext } from "../context/user.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";

const NotificationCard = ({ notification, index }) => {
  const [isUserReplying, setIsUserReplying] = useState(false);
  const {
    userAuth: { profile_img: author_Img, username: author_Username },
    userAuth,
  } = useContext(UserContext);

  const queryClient = useQueryClient();

  const {
    user: {
      personal_info: { profile_img, fullName, username },
      isEditor,
      isAdmin,
    },

    blog,
    comment,
    type,
    replied_on_comment,
    createdAt,
    reply,
    seen,
    message,
    _id: notificationId,
  } = notification;

  // console.log(message);
  // console.log(notification);

  /*=================== DELETE COMMENT OR REPLY ====================== */

  const { mutate } = useMutation({
    mutationFn: (deleteData) => {
      if (deleteData.type === "comment") {
        return makeRequest.delete(
          "/comment/delete-comment?commentId=" + deleteData.commentId
        );
      } else if (deleteData.type === "notification") {
        return makeRequest.delete(
          "/notification/delete-notification?notificationId=" +
            deleteData.notificationId
        );
      }
    },
    onSuccess: (res, deleteData) => {
      if (deleteData.type === "comment") {
        queryClient.invalidateQueries({
          queryKey: ["blog"],
        });
        queryClient.invalidateQueries({
          queryKey: ["comments"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong.");
    },
  });

  const deleteCommentHandler = (commentId, type, target) => {
    target.setAttribute("disabled", true);

    // console.log(commentId);

    mutate({
      commentId,
      type: "comment",
    });

    target.removeAttribute("disabled");
  };

  /*=================== DELETE Notification ====================== */

  const deleteNotificationHandler = (notificationId, target) => {
    target.setAttribute("disabled", true);

    // console.log(notificationId);
    mutate({
      type: "notification",
      notificationId: notificationId,
    });
    target.removeAttribute("disabled");
  };

  return (
    <div
      className={`px-1 py-6 md:p-6 border-b border-grey ${
        !seen ? "border-l-black border-l-2" : ""
      } `}
    >
      <Toaster />
      <div className="flex gap-5 mb-3">
        <img
          src={
            profile_img
          }
          className="w-14 h-14 rounded-full flex-none"
          alt="user image"
        />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="inline-block capitalize">
              {fullName.split(" ")[0]}
            </span>
            <Link
              to={`/users/${username}`}
              className="text-black mx-2 underline"
            >
              @{username}
            </Link>
            <span className="font-normal">
              {type === "like"
                ? "Liked your blog"
                : type === "comment"
                ? "Commented on"
                : type === "reply"
                ? "Replied on"
                : type == "editor"
                ? isEditor
                  ? "Editor"
                  : "User"
                : type === "admin"
                ? "Admin"
                : ""}
            </span>
            <button
              className="text-red/90 font-normal ml-4"
              onClick={(e) =>
                deleteNotificationHandler(notification._id, e.target)
              }
            >
              <i className="fi fi-rr-trash text-[14px] h-5"></i>
            </button>
          </h1>
          {message && <p className="my-2">{message}</p>}
          {type === "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-grey">
              <p>{replied_on_comment?.comment}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {message && blog?.title && (
                <p className="text-xl hover:no-underline">Check Link :</p>
              )}
              {blog?.title && (
                <Link
                  to={`/blogs/${blog?.title
                    .replace(/[?/|&]/g, "")
                    .split(" ")
                    .join("-")}-4v8i0p${blog._id}`}
                  className="font-medium text-dark-grey mt-[2px] hover:underline  line-clamp-1"
                >
                  {`"${blog?.title}"`}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {type !== "like" && type !== "editor" && type !== "admin" && (
        <p className="ml-14 pl-5 font-gelasio text-xl my-5">
          {comment?.comment}
        </p>
      )}
      <div className="ml-14 pl-5 mt-1 text-dark-grey flex gap-8">
        <p>{getFullDayFormate(createdAt)}</p>

        {type !== "like" && type !== "editor" && type !== "admin" && (
          <>
            {!reply && (
              <button
                className="underline hover:text-black"
                onClick={() => setIsUserReplying((prevState) => !prevState)}
              >
                Reply
              </button>
            )}
            <button
              className="text-red/90 underline"
              onClick={(e) =>
                deleteCommentHandler(comment._id, "comment", e.target)
              }
            >
              Delete
            </button>
          </>
        )}
      </div>
      {isUserReplying && (
        <div className="mt-8">
          <CommentField
            action={"Reply"}
            replyingTo={comment?._id}
            setIsUserReplying={setIsUserReplying}
            blogData={{ _id: blog._id, author: { _id: blog.author } }}
            notificationId={notificationId}
          />
        </div>
      )}
      {reply && (
        <div className="ml-20 px-4 py-3 bg-grey mt-4 rounded-md">
          <div className="flex gap-2 mb-2 items-center">
            <img
              src={
                author_Img
              }
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-medium text-xl text-dark-grey">
                <Link
                  to={`/users/${author_Username}`}
                  className="text-black mx-1 underline"
                >
                  @{author_Username}
                </Link>
                <span className="font-normal">to</span>
                <Link
                  to={`/users/${username}`}
                  className="text-black mx-2 underline"
                >
                  @{username}
                </Link>
                <button
                  className="text-red/90 font-normal ml-4"
                  onClick={(e) =>
                    deleteCommentHandler(reply._id, "reply", e.target)
                  }
                >
                  <i className="fi fi-rr-trash text-[14px] h-5"></i>
                </button>
              </div>
            </div>
          </div>

          <p className="ml-14 font-gelasio text-xl ">{reply.comment}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;

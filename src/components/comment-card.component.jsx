import React, { useContext, useEffect, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../context/user.context";
import { useLocation, useNavigate } from "react-router-dom";
import CommentField from "./comment-field.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import { toast } from "react-hot-toast";
const CommentCard = ({ commentData, index, leftValue, blogData }) => {
  const {
    userAuth: { username: auth_username },
  } = useContext(UserContext);

  const [isUserReplying, setIsUserReplying] = useState(false);
  const [isRepliesHide, setIsRepliesHide] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    _id: commentId,
    comment,
    commented_by,
    commentedAt,
    children,
    parent,
  } = commentData;

  const {
    author: {
      personal_info: { username: blog_author },
    },
  } = blogData;

  /*=================== REPLY OPEN / CLOSE ====================== */

  const replyOnCommentHandler = () => {
    if (!auth_username) {
      navigate("/login", {
        state: { path: location.pathname },
        replace: true,
      });
      return;
    }

    setIsUserReplying((prevState) => !prevState);
  };

  const hideRepliesHandler = () => {
    setIsRepliesHide((prevState) => !prevState);
  };

  /*=================== DELETE COMMENT OR REPLY ====================== */

  const { mutate } = useMutation({
    mutationFn: (deleteData) => {
      return makeRequest.delete(
        "/comment/delete-comment?commentId=" + deleteData.commentId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong.");
    },
  });

  // console.log(commentData);

  const deleteCommentHandler = (e) => {
    e.target.setAttribute("disabled", true);

    // console.log(commentId);

    mutate({
      commentId,
    });

    e.target.removeAttribute("disabled");
  };

  // console.log(isRepliesHideByParent, children);

  return (
    <div className={`w-full`} style={{ paddingLeft: `${leftValue * 10}px` }}>
      <div className="p-4 my-5 pb-3 rounded-md border border-gray">
        <div className="flex gap-3 items-center mb-4">
          <img
            src={commented_by?.personal_info?.profile_img}
            alt="profile image"
            className="w-6 h-6 rounded-full object-cover border border-gray"
          />
          <p className="line-clamp-1">
            {commented_by?.personal_info?.fullName.split(" ")[0]} @
            {commented_by?.personal_info?.username}
          </p>
          <p className="min-w-fit text-dark-grey capitalize">
            {getDay(commentedAt)}
          </p>
        </div>
        <p className="font-gelasio text-xl ml-2">{comment}</p>
        <div className="flex gap-5 items-center mt-2">
          {children?.length > 0 && (
            <button
              className="text-dark-grey p-2 px-5 hover:bg-grey/40 rounded-md flex items-center gap-2"
              onClick={hideRepliesHandler}
            >
              <i className="fi fi-rs-comment-dots"></i>
              {isRepliesHide ? "Hide" : `${children.length} Reply`}
            </button>
          )}

          <button className="underline" onClick={replyOnCommentHandler}>
            Reply
          </button>

          {auth_username === blog_author ||
          auth_username === commented_by?.personal_info?.username ? (
            <button
              className="text-red/95 ml-auto p-[9px] px-3 rounded-full flex items-center justify-center hover:bg-red/10 bg-gray/30"
              onClick={deleteCommentHandler}
            >
              <i className="fi fi-rr-trash text-[15px] h-5"></i>
            </button>
          ) : (
            ""
          )}
        </div>

        {isUserReplying && (
          <div className="mt-8">
            <CommentField
              action={"Reply"}
              blogData={blogData}
              index={index}
              setIsUserReplying={setIsUserReplying}
              replyingTo={commentId}
            />
          </div>
        )}
      </div>
      {/* Recursive rendering of children and their replies */}
      {isRepliesHide && children && children.length > 0 && (
        <div>{RenderChildren(children, leftValue + 1, blogData)}</div>
      )}
    </div>
  );
};

// Recursive helper function
const RenderChildren = (children, leftValue, blogData) => (
  <div>
    {children.map((childComment, childIndex) => (
      <CommentCard
        key={childComment._id}
        commentData={childComment}
        index={childIndex}
        leftValue={leftValue} // Adjust the leftValue for nested comments
        blogData={blogData}
      />
    ))}
  </div>
);

export default CommentCard;

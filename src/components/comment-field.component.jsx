import React, { useContext, useState } from "react";
import { UserContext } from "../context/user.context";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";

const CommentField = ({
  action,
  blogData,
  index = undefined,
  replyingTo = undefined,
  setIsUserReplying,
  notificationId = undefined,
}) => {
  const {
    userAuth: { username },
  } = useContext(UserContext);

  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    _id: blogObjId,
    author: { _id: authorId },
  } = blogData;

  /*=================== POST COMMENT ====================== */

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: (commentData) => {
      return makeRequest.post("/comment/add-comment", commentData);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });

      if (notificationId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });

        toast.success("Replied successfully");
      }
    },
  });

  // console.log(data);
  // console.log(blogData, authorId, "blog data");

  const addCommentHandler = () => {
    if (!username) {
      navigate("/login", { state: { path: location.pathname }, replace: true });
      return;
    }

    if (comment === "") {
      toast.error("Please write a comment.");
      return;
    }

    mutate({
      comment,
      blogId: blogObjId,
      blog_author: authorId,
      replying_to: replyingTo,
      notificationId: notificationId,
    });

    setComment("");
    if (replyingTo) {
      setIsUserReplying((prevState) => !prevState);
    }
  };

  return (
    <>
      <Toaster />
      <textarea
        name="comment"
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[120px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10 ml-2" onClick={addCommentHandler}>
        {action === "Comment"
          ? isPending
            ? "Commenting..."
            : "Comment"
          : isPending
          ? "Replying..."
          : "Reply"}
      </button>
    </>
  );
};

export default CommentField;

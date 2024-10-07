import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";

const BlogInteraction = ({ blogData, blogId, showHideCommentContainer }) => {
  const {
    userAuth,
    userAuth: { username },
  } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  let {
    _id: blogObjId,
    activity,
    title,
    activity: { total_likes, total_comments },
    author: {
      personal_info: { username: author_username },
    },
  } = blogData;

  // console.log(blogId);

  const [totalLiked, setTotalLiked] = useState(total_likes || 0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);

  /*=================== GET USER IF HE LIKED THIS BLOG ====================== */

  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["users", username],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/get-user/${username}`);
      return res.data;
    },
    enabled: !!username,
  });

  useEffect(() => {
    if (user && !isPending && !isError) {
      setIsLikedByUser(user?.likedBlogs?.includes(blogObjId));
    }
  }, [user, blogObjId, username, isPending, isError]);

  /*======================= LIKE AND DISLIKE ======================== */

  const { mutate, data } = useMutation({
    mutationFn: (likeData) => {
      return makeRequest.put("/blog/like-blog", likeData);
    },
    onError: (error) => {
      toast.error(error.response.data.error || "Opps! Something went wrong.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
    },
  });

  const likeBlogHandler = () => {
    if (!username) {
      navigate("/login", { state: { path: location.pathname }, replace: true });
      return;
    }

    setIsLikedByUser((prevState) => !prevState);

    !isLikedByUser
      ? setTotalLiked((prevState) => prevState + 1)
      : setTotalLiked((prevState) => prevState - 1);

    mutate({
      blogId: blogObjId,
      isLikedByUser: isLikedByUser, // Send the new liked state
    });
  };

  /*======================= COMMENTS CODE ======================== */

  return (
    <>
      <Toaster />
      <hr className="border-gray my-2" />

      <div className="flex gap-6">
        <div className="flex gap-3 items-center">
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center  ${
              isLikedByUser ? "bg-red/20 text-red " : "bg-grey/80"
            }`}
            onClick={likeBlogHandler}
          >
            <i
              className={`fi ${
                isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"
              } h-5 `}
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{totalLiked}</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
            onClick={showHideCommentContainer}
          >
            <i className="fi fi-rr-comment-dots h-5"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center ml-auto">
          {userAuth?.username === author_username ||
          userAuth.isAdmin === true ? (
            <Link
              to={`/editor/${blogId}`}
              className="underline hover:text-purple flex items-center gap-1"
            >
              <i className="fi fi-rr-file-edit mt-0 block"> Edit</i>
            </Link>
          ) : (
            ""
          )}

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
            className="h-5 block"
          >
            <i className="fi fi-brands-twitter hover:text-twitter "></i>
          </Link>
        </div>
      </div>

      <hr className="border-gray my-2" />
    </>
  );
};

export default BlogInteraction;

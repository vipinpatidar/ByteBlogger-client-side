import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ReadLaterBtn = ({ blogId, user, username, isPending, isError }) => {
  const [isReadLaterByUser, setIsReadLaterByUser] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && !isPending && !isError) {
      setIsReadLaterByUser(user?.readLaterBlogs?.includes(blogId));
    }
  }, [user, blogId, username, isPending, isError]);

  /*======================= LIKE AND DISLIKE ======================== */

  const { mutate, data } = useMutation({
    mutationFn: (readLaterData) => {
      return makeRequest.put("/favorites/read-later", readLaterData);
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

  const readLaterBlogHandler = () => {
    if (!username) {
      navigate("/login", { state: { path: location.pathname }, replace: true });
      return;
    }

    setIsReadLaterByUser((prevState) => !prevState);

    mutate({
      blogId: blogId,
      isReadLaterByUser: isReadLaterByUser, // Send the new liked state
    });
  };

  // console.log(blogId);
  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center  ${
        isReadLaterByUser ? "bg-purple/20 text-purple " : "bg-grey/80"
      }`}
      onClick={readLaterBlogHandler}
    >
      <i
        className={`fi ${
          isReadLaterByUser ? "fi-sr-bookmark" : "fi-rr-bookmark"
        } h-5 `}
      ></i>
    </button>
  );
};

export default ReadLaterBtn;

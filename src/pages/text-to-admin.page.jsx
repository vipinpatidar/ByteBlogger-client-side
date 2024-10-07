import React, { useContext, useState } from "react";
import { UserContext } from "../context/user.context";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";

const TextToAdmin = () => {
  const {
    userAuth: { username, isAdmin },
  } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  /*======================= FETCH USERS ON QUERY ======================== */
  const {
    data: users,
    isPending: isUsersPending,
    error: usersError,
  } = useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      const res = await makeRequest.get(
        `/users/search-users?userQuery=${query}`
      );
      return res.data;
    },
    enabled: !!isAdmin,
  });

  /*=================== POST message ====================== */

  const { mutate } = useMutation({
    mutationFn: (messageData) => {
      return makeRequest.post(
        "/notification/add-message-notification",
        messageData
      );
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.success("Send you message successfully");
    },
  });

  // console.log(selectedUsername);

  const addMessageHandler = () => {
    if (!username) {
      navigate("/login", { state: { path: location.pathname }, replace: true });
      return;
    }

    if (message === "") {
      toast.error("Please write a message.");
      return;
    }

    if (isAdmin && selectedUsername === "") {
      toast.error("Please Search and select username who you want to notify.");
      return;
    }

    mutate({
      message,
      username: isAdmin ? selectedUsername : undefined,
    });

    setMessage("");
    setSelectedUsername("");
  };

  return (
    <div className="max-w-[500px] mt-4  p-4 mx-auto">
      <h1 className="mb-8 text-2xl">
        {isAdmin
          ? "Send Notification To An Editor"
          : "Send Notification To Blogs Admin"}
      </h1>
      <Toaster />
      {isAdmin && (
        <div className=" mb-4 relative">
          <input
            type="search"
            name="username"
            id="username"
            className="input-box pl-5"
            placeholder="Search and Select username of editor or user"
            onChange={(e) => {
              setSelectedUsername(e.target.value);
              setQuery(e.target.value);
            }}
            autoComplete="off"
            value={selectedUsername}
          />

          {query.length > 0 && (
            <ul className="absolute top-[101%] left-0 bg-white shadow-md w-full flex flex-col py-3 justify-center">
              {!isUsersPending && users?.length === 0 ? (
                <NoDataMessage
                  message={`No User found with ${query} username or name`}
                  error={usersError}
                  styles={
                    "text-center w-[90%] mx-auto p-3 text-red rounded-full bg-grey/50"
                  }
                />
              ) : !usersError && users?.length > 0 ? (
                users?.map((user, idx) => (
                  <AnimationWrapper
                    key={user._id}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  >
                    <li
                      className="pl-10 py-4 border-b border-gray hover:bg-gray cursor-pointer"
                      onClick={() => {
                        setSelectedUsername(user?.personal_info?.username);
                        setQuery("");
                      }}
                    >
                      {user?.personal_info?.username}
                      {user?.personal_info?.username === selectedUsername &&
                        setQuery("")}
                    </li>
                  </AnimationWrapper>
                ))
              ) : (
                isUsersPending && <Loader />
              )}
            </ul>
          )}
        </div>
      )}
      <textarea
        name="message"
        id="message"
        value={message}
        maxLength={300}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Leave a message..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[120px] overflow-auto"
      ></textarea>
      <p className="text-black text-sm text-right">Maximum 300 characters</p>
      <button className="btn-dark mt-4 px-10 ml-2" onClick={addMessageHandler}>
        Send
      </button>
    </div>
  );
};

export default TextToAdmin;

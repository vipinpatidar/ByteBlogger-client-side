import React from "react";
import { Link } from "react-router-dom";

const EditorUserCard = ({ user, mutate }) => {
  const {
    _id: userId,
    personal_info: { fullName, username, profile_img },
    isEditor,
    account_info: { total_posts, total_reads },
  } = user;

  // console.log(user);

  /*================ ADD REMOVE EDITOR ================== */
  const addRemoveEditorHandler = () => {
    mutate({
      userId: userId,
      isEditor: !isEditor,
    });
  };

  return (
    <div className="border-b mb-6 border-grey pb-6">
      <div className="flex gap-4 items-center flex-col md:flex-row flex-wrap lg:flex-nowrap">
        <img
          src={
            profile_img
          }
          className={`${
            isEditor ? "w-20 h-20" : "w-16 h-16"
          } rounded-full flex-none`}
          alt="user image"
        />
        <div className="flex flex-col items-center gap-2 md:items-start py-2 w-full ">
          <div className="font-medium text-xl text-dark-grey flex items-center">
            <span className="inline-block capitalize text-xl">{fullName}</span>
            <Link
              to={`/users/${username}`}
              className="text-black mx-2 underline"
            >
              @{username}
            </Link>
          </div>
          {isEditor && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[15px]">Total Post:</span>
                <p>{total_posts}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px]">Total Reads:</span>
                <p>{total_reads}</p>
              </div>
            </div>
          )}
        </div>
        <button className="btn-dark" onClick={addRemoveEditorHandler}>
          {isEditor ? " Remove" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default EditorUserCard;

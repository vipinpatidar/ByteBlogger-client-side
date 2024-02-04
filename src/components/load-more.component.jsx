import React from "react";

const LoadMoreDataBtn = ({ fetchNextPage, isFetchingNextPage }) => {
  const addMoreBlogsHandler = () => {
    fetchNextPage();
  };

  return (
    <button
      onClick={addMoreBlogsHandler}
      disabled={isFetchingNextPage}
      className=" text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
    >
      Load More Blogs
    </button>
  );
};

export default LoadMoreDataBtn;

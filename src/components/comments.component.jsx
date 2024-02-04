import React, { useEffect, useState } from "react";
import CommentField from "./comment-field.component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import CommentCard from "./comment-card.component";
import NoDataMessage from "./nodata.component";
import Loader from "./loader.component";

const CommentsContainer = ({
  isCommentWrapper,
  blogData,
  blogId,
  showHideCommentContainer,
}) => {
  const {
    _id: blogObjId,
    title,
    activity: { total_parent_comments },
  } = blogData;

  /*=================== GET COMMENTS ====================== */

  const fetchComments = async ({ pageParam }) => {
    const res = await makeRequest.get(
      `/comment/get-comments?blogId=${blogObjId}&skip=${pageParam}`
    );
    return res.data;
  };

  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", blogObjId],
    queryFn: fetchComments,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

  const loadMoreComments = () => {
    fetchNextPage();
  };

  // console.log(data?.pages);

  return (
    <div
      className={`max-sm:w-[95%] fixed ${
        isCommentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"
      } duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-10 overflow-y-auto overflow-x-hidden`}
    >
      <div className="relative mt-7">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 text-dark-grey ">{title}</p>

        <button
          className="absolute -top-12 -left-[22px] flex justify-center items-center w-9 h-9 rounded-full bg-grey"
          onClick={showHideCommentContainer}
        >
          <i className="fi fi-sr-cross-small text-2xl h-7"></i>
        </button>
      </div>
      <hr className="border-grey my-8 w-[120%] -ml-4" />
      <CommentField action={"Comment"} blogData={blogData} />
      <hr className="border-grey my-8 w-[120%] -ml-4" />

      {!isFetching && data?.pages[0]?.comments?.length === 0 ? (
        <NoDataMessage message={"No comment"} error={error} />
      ) : !error && data?.pages[0]?.comments?.length > 0 ? (
        data?.pages?.map((page, pageIndex) => {
          return (
            <React.Fragment key={pageIndex}>
              {page?.comments.map((comment, index) => (
                <CommentCard
                  key={comment._id}
                  commentData={comment}
                  index={index}
                  leftValue={0 * 4}
                  blogData={blogData}
                />
              ))}
            </React.Fragment>
          );
        })
      ) : (
        isFetching && <Loader />
      )}
      {isFetchingNextPage && <span>Loading more...</span>}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={loadMoreComments}
          className="text-dark-grey p-2 px-3 hover:bg-grey/60 rounded-md items-center flex gap-2"
        >
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default CommentsContainer;

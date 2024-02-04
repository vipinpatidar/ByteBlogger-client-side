import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import Loader from "../components/loader.component";
import { makeRequest } from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
  const { query } = useParams();
  const activeTabRef = useRef();
  // console.log(query);

  /*======================= GET / SET SEARCH QUERY ======================== */

  const {
    data: blogsData,
    error: blogsError,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", query],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/blog/get-blogs?category=${query}&page=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

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
  });

  // console.log(users);

  /*======================= JSX ======================== */

  return (
    <section className="h-cover flex gap-10 ">
      <Toaster />
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results for ${query}`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
          activeTabRef={activeTabRef}
        >
          <>
            {!isFetching && blogsData?.pages[0]?.blogs?.length === 0 ? (
              <NoDataMessage
                message={"No blog found. You can read other good blogs :)"}
                error={blogsError}
              />
            ) : !blogsError && blogsData?.pages[0]?.blogs?.length > 0 ? (
              blogsData.pages?.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page?.blogs?.map((blog, idx) => (
                    <AnimationWrapper
                      key={blog._id}
                      transition={{ duration: 1, delay: idx * 0.15 }}
                    >
                      <BlogPostCard
                        blog={blog}
                        author={blog.author?.personal_info}
                      />
                    </AnimationWrapper>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <Loader />
            )}
            {hasNextPage && (
              <LoadMoreDataBtn
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            )}
          </>
          {/* ================== USER DATA =================== */}
          <>
            {!isUsersPending && users?.length === 0 ? (
              <NoDataMessage
                message={`No User found with ${query} username or name`}
                error={usersError}
              />
            ) : !usersError && users?.length > 0 ? (
              users?.map((user, idx) => (
                <AnimationWrapper
                  key={user._id}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                >
                  <UserCard user={user} />
                </AnimationWrapper>
              ))
            ) : (
              isUsersPending && <Loader />
            )}
          </>
        </InPageNavigation>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User related to search <i className="fi fi-rr-user"></i>
        </h1>
        {/* ================== USER DATA =================== */}
        <>
          {!isUsersPending && users?.length === 0 ? (
            <NoDataMessage
              message={`No User found with ${query} username or name`}
              error={usersError}
            />
          ) : !usersError && users?.length > 0 ? (
            users?.map((user, idx) => (
              <AnimationWrapper
                key={user._id}
                transition={{ duration: 1, delay: idx * 0.1 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            ))
          ) : (
            isUsersPending && <Loader />
          )}
        </>
      </div>
    </section>
  );
};

export default SearchPage;

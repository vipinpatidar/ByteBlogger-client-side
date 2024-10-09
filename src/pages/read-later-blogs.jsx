import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import LoadMoreDataBtn from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";

const ReadLaterBlogs = () => {
  const [query, setQuery] = useState("");

  /*================== FETCH LOGGED USER BLOGS ===================== */
  const {
    data: blogsData,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["readLaterBlogs", query],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/favorites/read-later?search=${query}&page=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

  // console.log(blogsData);

  return (
    <div className=" mx-auto pb-12">
      <h1 className="text-2xl my-4">Your Saved Blogs</h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          name="search"
          id="search"
          className="w-full bg-grey p-4 pl-10 pr-20 rounded-full md:pl-14 placeholder:text-dark-grey "
          placeholder="Search blog..."
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
        />
        <i className="fi fi-rr-search absolute right-[5%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <>
        {!isFetching && blogsData?.pages[0]?.readLaterBlogs?.length === 0 ? (
          <NoDataMessage message={"No blog found :)"} error={error} />
        ) : !error && blogsData?.pages[0]?.readLaterBlogs?.length > 0 ? (
          blogsData.pages?.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page?.readLaterBlogs?.map((blog, idx) => {
                // console.log(blog);

                return (
                  <AnimationWrapper
                    key={blog._id}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  >
                    <BlogPostCard
                      blog={blog}
                      author={blog?.author?.personal_info}
                    />
                  </AnimationWrapper>
                );
              })}
            </React.Fragment>
          ))
        ) : (
          isFetching && <Loader />
        )}
        {hasNextPage && (
          <LoadMoreDataBtn
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </>
    </div>
  );
};

export default ReadLaterBlogs;

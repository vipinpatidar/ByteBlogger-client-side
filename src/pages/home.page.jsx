import React, { useEffect, useRef, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import TrendingBlogPost from "../components/trending-blogs.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";

// const categories = [
//   "lifestyle",
//   "finance",
//   "science",
//   "food",
//   "health",
//   "travel",
//   "review",
//   "research",
//   "programming",
// ];
const categories = [
  "frontend",
  "html",
  "css",
  "javascript",
  "react",
  "typescript",
  "backend",
  "nodejs",
  "database",
  "mongoDB",
  "SQL",
  "api",
  "git",
  "nextjs",
  "programming",
];

const HomePage = () => {
  const [pageState, setPageState] = useState("home");

  const activeTabRef = useRef();
  /*======================= GET / SET CATEGORY ======================== */

  const getCategoryHandler = (category) => {
    if (pageState === category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();
  }, [pageState]);

  // console.log(page);

  /*======================= FETCH LATEST BLOGS ======================== */
  /*======================= FETCH FILTERED BLOGS ======================== */

  const {
    data: blogsData,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", pageState],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/blog/get-blogs?category=${pageState}&page=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

  /*======================= FETCH TENDING BLOGS ======================== */
  const {
    data: trendBlogs,
    isPending: isPendingTrendBlog,
    error: trendError,
  } = useQuery({
    queryKey: ["blogs", "trendBlogs"],
    queryFn: async () => {
      const res = await makeRequest.get("/blog/get-trending-blogs");
      return res.data;
    },
  });

  // console.log(trendBlogs);
  /*======================= JSX ======================== */

  return (
    <AnimationWrapper>
      <Toaster />
      <section className="flex h-cover justify-center gap-10 relative">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
            activeTabRef={activeTabRef}
          >
            <>
              <div className="md:hidden mb-8">
                <h1 className="font-medium text-xl mb-8 ">
                  Articles from all interests
                </h1>

                <div className="flex gap-3 flex-wrap">
                  {categories.map((category, idx) => (
                    <button
                      onClick={() => getCategoryHandler(category.toLowerCase())}
                      className={`tag ${
                        pageState.toLowerCase() === category.toLowerCase()
                          ? "bg-black text-white"
                          : ""
                      }`}
                      key={idx}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              {!isFetching && blogsData?.pages[0]?.blogs?.length === 0 ? (
                <NoDataMessage
                  message={"No blog found. You can read other good blogs :)"}
                  error={error}
                />
              ) : !error && blogsData?.pages[0]?.blogs?.length > 0 ? (
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
            {/* ========================= Trending Blogs posts ======================== */}
            <>
              {isPendingTrendBlog ? (
                <Loader />
              ) : !trendError && trendBlogs?.length > 0 ? (
                trendBlogs?.map((blog, idx) => (
                  <AnimationWrapper
                    key={blog._id}
                    transition={{ duration: 1, delay: idx * 0.15 }}
                  >
                    <TrendingBlogPost
                      blog={blog}
                      author={blog.author?.personal_info}
                      index={idx}
                    />
                  </AnimationWrapper>
                ))
              ) : (
                <NoDataMessage
                  message={"No Trending Blog found."}
                  error={trendError}
                />
              )}
            </>
          </InPageNavigation>
        </div>
        {/* ========================= Trending Blogs and filter ======================== */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-7 pt-3 max-md:hidden sticky top-5">
          <div className="flex flex-col gap-10 ">
            <div>
              <h1 className="font-medium text-xl mb-8 ">
                Articles from all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, idx) => (
                  <button
                    onClick={() => getCategoryHandler(category.toLowerCase())}
                    className={`tag ${
                      pageState.toLowerCase() === category.toLowerCase()
                        ? "bg-black text-white"
                        : ""
                    }`}
                    key={idx}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8 flex items-center gap-3">
                Trending <i className="fi fi-rr-arrow-trend-up h-6 mt-0"></i>
              </h1>
              <>
                {isPendingTrendBlog ? (
                  <Loader />
                ) : !trendError && trendBlogs?.length > 0 ? (
                  trendBlogs?.map((blog, idx) => (
                    <AnimationWrapper
                      key={blog._id}
                      transition={{ duration: 1, delay: idx * 0.15 }}
                    >
                      <TrendingBlogPost
                        blog={blog}
                        author={blog.author?.personal_info}
                        index={idx}
                      />
                    </AnimationWrapper>
                  ))
                ) : (
                  <NoDataMessage
                    message={"No Trending Blog found."}
                    error={trendError}
                  />
                )}
              </>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;

import React, { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import LoadMoreDataBtn from "../components/load-more.component";
import ManagePublishedBlogCard from "../components/manage-publishedBlogCard.component";
import ManageDraftBlogCard from "../components/manage-draftBlogCard";
import { useSearchParams } from "react-router-dom";

const ManageBlogPage = () => {
  const [query, setQuery] = useState("");
  const [changeBoolean, setChangeBoolean] = useState(false);
  const [pageState] = useState("Published Blogs");
  const [searchParams] = useSearchParams();

  const activeTabRef = useRef();

  useEffect(() => {
    activeTabRef.current.click();
  }, [pageState]);

  const queryClient = useQueryClient();

  const tab = searchParams.get("tab");
  const isAdmin = searchParams.get("isAdmin");

  // console.log(isAdmin);

  useEffect(() => {
    activeTabRef.current.click();
  }, [pageState]);

  useEffect(() => {
    if (tab && tab === "draft") {
      setChangeBoolean(true);
    }
  }, [tab]);

  /*================== FETCH LOGGED USER BLOGS ===================== */
  const {
    data: blogsData,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["dashboardBlogs", query, changeBoolean, isAdmin],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/blog/get-dashboard-blogs?query=${query}&page=${pageParam}&draft=${changeBoolean}&isAdmin=${isAdmin}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

  // console.log(blogsData);

  /*================== DELETE BLOGS ===================== */

  const { mutate } = useMutation({
    mutationFn: (deleteData) => {
      return makeRequest.delete(
        `/blog/delete-blog?blogId=${deleteData.blogId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardBlogs"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong.");
    },
  });

  return (
    <div className=" mx-auto pb-12">
      <Toaster />
      <h1 className="text-2xl my-4">
        {isAdmin === "true" ? "Manage Editors Blogs" : "Manage Your Blogs"}
      </h1>
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

      <InPageNavigation
        routes={[pageState, "Drafts"]}
        defaultHidden={[]}
        activeTabRef={activeTabRef}
        setChangeBoolean={setChangeBoolean}
        defaultActiveIndex={tab === "draft" ? 1 : 0}
      >
        <>
          {!isFetching && blogsData?.pages[0]?.blogs?.length === 0 ? (
            <NoDataMessage message={"No blog found :)"} error={error} />
          ) : !error && blogsData?.pages[0]?.blogs?.length > 0 ? (
            blogsData.pages?.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page?.blogs?.map((blog, idx) => (
                  <AnimationWrapper
                    key={blog._id}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  >
                    {!changeBoolean && (
                      <ManagePublishedBlogCard
                        blog={blog}
                        mutate={mutate}
                        isAdmin={isAdmin}
                      />
                    )}
                    {changeBoolean && (
                      <ManageDraftBlogCard
                        blog={blog}
                        index={idx + 1}
                        mutate={mutate}
                        isAdmin={isAdmin}
                      />
                    )}
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
      </InPageNavigation>
    </div>
  );
};

export default ManageBlogPage;

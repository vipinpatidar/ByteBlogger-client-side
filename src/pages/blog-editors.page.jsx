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
import { useSearchParams } from "react-router-dom";
import EditorUserCard from "../components/editor-user-card.component";

const BlogEditors = () => {
  const [query, setQuery] = useState("");
  const [changeBoolean, setChangeBoolean] = useState(false);
  const [pageState] = useState("All Blogs Editors");
  const [searchParams] = useSearchParams();

  const activeTabRef = useRef();

  useEffect(() => {
    activeTabRef.current.click();
  }, [pageState]);

  const queryClient = useQueryClient();

  const isAdmin = searchParams.get("isAdmin");

  // console.log(isAdmin);

  /*================== FETCH LOGGED USER BLOGS ===================== */
  const {
    data: editorsData,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["editor-users", query, changeBoolean, isAdmin],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/users//get-editors?query=${query}&page=${pageParam}&isEditor=${
          changeBoolean ? false : true
        }`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
  });

  // console.log(editorsData);

  /*================== DELETE BLOGS ===================== */

  const { mutate } = useMutation({
    mutationFn: (editorData) => {
      return makeRequest.put(`/users/update-as-editor`, {
        userId: editorData.userId,
        isEditor: editorData.isEditor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["editor-users"],
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["dashboardBlogs"],
      // });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong.");
    },
  });

  return (
    <div className=" mx-auto pb-12 max-w-[650px]">
      <Toaster />
      <h1 className="text-2xl my-4">
        {changeBoolean ? "Search Other Users" : "All Blogs Editors"}
      </h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          name="search"
          id="search"
          className="w-full bg-grey p-4 pl-10 pr-20 rounded-full md:pl-14 placeholder:text-dark-grey "
          placeholder="Search name or email..."
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
        />
        <i className="fi fi-rr-search absolute right-[5%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation
        routes={[pageState, "Search Other Users"]}
        defaultHidden={[]}
        activeTabRef={activeTabRef}
        setChangeBoolean={setChangeBoolean}
      >
        <>
          {!isFetching && editorsData?.pages[0]?.users?.length === 0 ? (
            <NoDataMessage message={"No Editor found :)"} error={error} />
          ) : !error && editorsData?.pages[0]?.users?.length > 0 ? (
            editorsData.pages?.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page?.users?.map((user, idx) => (
                  <AnimationWrapper
                    key={user._id}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={"mt-4"}
                  >
                    <EditorUserCard user={user} mutate={mutate} />
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

export default BlogEditors;

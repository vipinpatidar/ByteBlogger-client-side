import { useState, useEffect, useRef } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";

/*======================= FETCH USER BLOGS ======================== */

const useGetBlogs = (query, queKey, username) => {
  const {
    data: blogsData,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", query],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/blog/get-blogs?${queKey}=${query}&page=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
    enabled: !!query,
  });

  // console.log(fetchedBlogs);

  return [fetchedBlogs, setPage, blogsData, isBlogsPending, blogsError];
};

export default useGetBlogs;

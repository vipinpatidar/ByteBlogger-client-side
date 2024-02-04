import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";

/*======================= FETCH USER BLOGS ======================== */

const useGetBlogs = (query, queKey, username) => {
  const [page, setPage] = useState(1);
  const [fetchedBlogs, setFetchedBlogs] = useState([]);

  const {
    data: blogsData,
    isPending: isBlogsPending,
    error: blogsError,
  } = useQuery({
    queryKey: ["blogs", query, page],
    queryFn: async () => {
      const res = await makeRequest.get(
        `/blog/get-blogs?${queKey}=${query}&page=${page}`
      );
      return res.data;
    },
    enabled: !!query,
  });
  // console.log(blogsData);
  // console.log(query);

  //if query changed then reset the blog data and page

  useEffect(() => {
    setPage(1);
    setFetchedBlogs([]);
  }, [query]);

  // if query has more blog then add to previous blogs

  useEffect(() => {
    if (query) {
      if (!blogsError && !isBlogsPending && blogsData?.blogs) {
        setFetchedBlogs((prevData) => {
          let array = [...blogsData.blogs, ...prevData];

          if (page > 1) {
            array = [...prevData, ...blogsData.blogs];
          }

          // console.log(page);
          const uniqueBlogs = array.filter(
            (blog, index, self) =>
              index === self.findIndex((b) => b._id === blog._id)
          );
          return uniqueBlogs;
        });
      }
    }
  }, [query, page, blogsData]);

  // console.log(fetchedBlogs);

  return [fetchedBlogs, setPage, blogsData, isBlogsPending, blogsError];
};

export default useGetBlogs;

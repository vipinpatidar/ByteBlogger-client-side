import React, { useState, useContext, useEffect } from "react";
import BlogEditor from "../components/blog-editor.component";
import PublishBlogForm from "../components/publish-form.component";
import { EditorContext } from "../context/editor.context";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import Loader from "../components/loader.component";

const isEditorPage = () => {
  const [isEditorPage, setIsEditorPage] = useState(true);
  const { blogInputs, setBlogInputs } = useContext(EditorContext);
  const { blogId } = useParams();

  // console.log(blogId);
  // console.log(blogInputs);

  const location = useLocation();
  const linkState = location.state?.link;

  const {
    data: blogData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await makeRequest.get(
        `/blog/get-blog/${blogId}?draft=${true}&mode=edit`
      );
      return res.data;
    },
    enabled: !!blogId,
  });

  const changePageHandler = () => {
    setIsEditorPage((prevState) => !prevState);
  };

  useEffect(() => {
    if (!isPending && !error && blogData) {
      setBlogInputs(blogData);
    }
  }, [blogData]);

  // console.log(blogInputs);

  return (
    // <EditorContextProvider>
    blogId && isPending ? (
      <Loader />
    ) : isEditorPage ? (
      <BlogEditor
        changePageHandler={changePageHandler}
        isBlogPending={isPending}
        blogError={error}
        blogData={blogData}
        blogId={blogId}
        linkState={linkState}
      />
    ) : (
      <PublishBlogForm
        blogId={blogId}
        changePageHandler={changePageHandler}
        linkState={linkState}
      />
    )
    // </EditorContextProvider>
  );
};

export default isEditorPage;

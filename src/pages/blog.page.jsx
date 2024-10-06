import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../utils/axios";
import Error404 from "./404.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getTimeFormate } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer from "../components/comments.component";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  tags: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

const BlogPage = () => {
  const { blogId } = useParams();
  //   console.log(blogId);
  const [isCommentWrapper, setIsCommentWrapper] = useState(false);

  /*======================= FETCH OPENED BLOG ======================== */

  const { data: blogData, isPending } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await makeRequest.get(`/blog/get-blog/${blogId}`);
      return res.data;
    },
  });

  const {
    title,
    banner,
    content,
    tags,
    des,
    _id: blogObjId,
    author: {
      personal_info: { fullName, username: author_username, profile_img },
      _id: authorId,
    },
    publishedAt,
  } = blogData || blogStructure;

  // console.log(content);
  /*======================= FETCH SIMILAR BLOGS ======================== */

  const {
    data: similarBLogs,
    isPending: isSimilarBlogsPending,
    error: similarBLogsError,
  } = useQuery({
    queryKey: ["blogs", blogId],
    queryFn: async () => {
      const res = await makeRequest.get(
        `/blog/get-blogs?tags=${tags.join(",")}&removeBlogId=${blogObjId}`
      );
      return res.data;
    },
    enabled: !!tags.length,
  });

  // console.log(similarBLogs);

  if (!isPending && !blogData) {
    return <Error404 />;
  }

  /*======================= COMMENT SECTION CODE ======================== */

  const showHideCommentContainer = () => {
    setIsCommentWrapper((prevState) => !prevState);
  };

  /*======================= JSX ======================== */

  return (
    <AnimationWrapper>
      {isPending ? (
        <Loader />
      ) : (
        !isPending &&
        blogData && (
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <CommentsContainer
              isCommentWrapper={isCommentWrapper}
              blogData={blogData}
              blogId={blogId}
              showHideCommentContainer={showHideCommentContainer}
            />
            <img
              src={`${banner}`}
              alt="blog banner image"
              className="aspect-video"
            />
            <div className="mt-12">
              <h2 className="mb-3 font-gelasio">{title}</h2>

              <p className="text-[18px] text-dark-grey">{des}</p>

              <div className="flex items-center flex-wrap justify-between my-8">
                <Link
                  to={`/users/${author_username}`}
                  className="flex gap-4 items-start mb-2"
                >
                  <img
                    src={profile_img}
                    alt="profile image"
                    className="w-12 h-12 rounded-full border border-grey"
                  />

                  <div>
                    {fullName}
                    <br />
                    <p className="underline">@{author_username}</p>
                  </div>
                </Link>
                <p className="text-dark-grey opacity-75 max-sm:ml-4 max-sm:pl-5 flex items-center gap-3">
                  <i className="fi fi-rr-calendar-lines mt-0 h-5 text-black"></i>{" "}
                  Published on {getTimeFormate(publishedAt)}
                </p>
              </div>
            </div>

            <BlogInteraction
              blogData={blogData}
              blogId={blogId}
              showHideCommentContainer={showHideCommentContainer}
            />
            {/* Blog content will come here */}
            <div className="my-12  blog-page-content">
              {content[0].blocks?.map((block, idx) => {
                return (
                  <div key={idx} className="my-4 md:my-8">
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>
            <BlogInteraction
              blogData={blogData}
              blogId={blogId}
              showHideCommentContainer={showHideCommentContainer}
            />
            {similarBLogs?.blogs?.length > 0 && (
              <h1 className="text-2xl mt-14 mb-8 font-medium">
                Similar Blogs{" "}
              </h1>
            )}
            {!similarBLogsError &&
            !isSimilarBlogsPending &&
            similarBLogs?.blogs?.length > 0
              ? similarBLogs?.blogs?.map((blog, idx) => (
                  <AnimationWrapper
                    key={blog._id}
                    transition={{ duration: 1, delay: idx * 0.15 }}
                  >
                    <BlogPostCard
                      blog={blog}
                      author={blog.author?.personal_info}
                    />
                  </AnimationWrapper>
                ))
              : isSimilarBlogsPending && <Loader />}
          </div>
        )
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;

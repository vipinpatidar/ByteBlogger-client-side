import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { makeRequest } from "../utils/axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../context/user.context";
import AboutUser from "../components/about.component";
import InPageNavigation from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import BlogPostCard from "../components/blog-post.component";
import LoadMoreDataBtn from "../components/load-more.component";
import Error404 from "./404.page";

export const profileDummyDataStructure = {
  personal_info: {
    fullName: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
  likedBlogs: [],
  blogs: [],
};

const ProfilePage = () => {
  const { username } = useParams();
  const { userAuth } = useContext(UserContext);
  const activeTabRef = useRef();
  const navigate = useNavigate();
  //   console.log(username);

  useEffect(() => {
    activeTabRef?.current?.click();
  }, [username]);

  /*======================= FETCH USER DATA ======================== */

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["users", username],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/get-user/${username}`);
      return res.data;
    },
  });

  // console.log(user);

  /*======================= FETCH USER BLOGS ======================== */

  const authorId = user?._id;

  // console.log(authorId);

  const {
    data: blogsData,
    error: blogsError,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", authorId],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(
        `/blog/get-blogs?authorId=${authorId}&page=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
    enabled: !!authorId,
  });

  /*======================= JSX ======================== */

  const {
    personal_info: { fullName, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = user || profileDummyDataStructure;

  const isBackendProfileImg =
    typeof profile_img === "string" && profile_img.includes("/uploads");

  if (isPending) {
    return <Loader />;
  }

  return !isPending && !user ? (
    <Error404 />
  ) : (
    <AnimationWrapper>
      {isPending ? (
        <Loader />
      ) : (
        !error &&
        user && (
          <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col items-center gap-5 min-w-[250px] md:w-[40%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
              <img
                src={
                  isBackendProfileImg
                    ? import.meta.env.VITE_HOST_URL + profile_img
                    : profile_img
                }
                alt="profile image"
                className="w-40 h-40 bg-grey rounded-full md:w-32 md:h-32 border border-grey"
              />
              <h1 className="text-2xl font-medium">{profile_username}</h1>
              <p className="text-xl capitalize h-6">{fullName}</p>
              <p>
                {total_posts.toLocaleString()} Blogs -{" "}
                {total_reads.toLocaleString()} Reads
              </p>
              {username === userAuth.username && (
                <div className="flex gap-4 mt-2">
                  <Link
                    to={"/settings/edit-profile"}
                    className="btn-light rounded-md"
                  >
                    Edit Profile
                  </Link>
                </div>
              )}
              <AboutUser
                className="max-md:hidden"
                bio={bio}
                socialLinks={social_links}
                joinedAt={joinedAt}
              />
            </div>
            {/* ========== BLOGS ============ */}
            <div className="max-md:mt-12 w-full">
              <InPageNavigation
                routes={[
                  `${
                    user?.isAdmin || user?.isEditor
                      ? "Published Blogs"
                      : userAuth.isAuthenticated === false
                      ? "Published Blogs"
                      : "Become An Editor"
                  }`,
                  "About",
                ]}
                activeTabRef={activeTabRef}
                defaultHidden={["About"]}
              >
                <>
                  {!isFetching && blogsData?.pages[0]?.blogs?.length === 0 ? (
                    userAuth.isAdmin || userAuth.isEditor ? (
                      <NoDataMessage
                        message={
                          "No blog found. You can read other good blogs :)"
                        }
                        error={blogsError}
                      />
                    ) : userAuth?.isAuthenticated ? (
                      <div className="flex flex-col justify-center items-center mt-20 mb-20 gap-3">
                        <h1 className="text-2xl font-medium">
                          Want to write your own blogs or save draft
                        </h1>
                        <p className="text-xl">
                          Check out our policy and price
                        </p>
                        <button
                          className="btn-dark mt-4"
                          onClick={() => navigate("/becomeEditor")}
                        >
                          Check Here
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center mt-20 mb-20 gap-3">
                        <h1 className="text-2xl font-medium">Nothing here</h1>
                      </div>
                    )
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

                <AboutUser
                  className=""
                  bio={bio}
                  socialLinks={social_links}
                  joinedAt={joinedAt}
                />
              </InPageNavigation>
            </div>
          </section>
        )
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;

import React, { useContext, useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../context/editor.context";
import { makeRequest } from "../utils/axios";
import Tags from "./tags.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useImageUploader from "../hook/useImageUploader";

const PublishBlogForm = ({ changePageHandler, blogId, linkState }) => {
  // const [character, setCharacter] = useState(0);

  const characterLimit = 200;
  let tagLimit = 10;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isLoading, error, getUploadedImg] = useImageUploader();

  // console.log(blogId);

  const {
    blogInputs: { title, banner, tags, des, content },
    blogInputs,
    setBlogInputs,
  } = useContext(EditorContext);

  // console.log(blogInputs);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const isBackendBanner =
    typeof blogInputs.banner === "string" &&
    blogInputs.banner?.includes("/vipinpatidar5/");

  // console.log(isBackendBanner);

  /*======================= UPLOAD IMAGE ============================== */

  const upload = async (image) => {
    try {
      const UploadedImg = await getUploadedImg(image);

      if (UploadedImg) {
        return UploadedImg;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      const err = error?.response?.data?.error || "Image upload failed.";
      toast.error(err);
    }
  };

  /*======================= POST BLOG TO BACKEND ======================== */

  const { isPending, mutate, data } = useMutation({
    mutationFn: (blogData) => {
      return makeRequest.post("/blog/create-blog", blogData);
    },
    onError: (error) => {
      const err = error.response.data.error || "Opps! Something went wrong.";
      toast.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboardBlogs"],
      });

      toast.success(
        isBackendBanner
          ? "Blog Updated successfully"
          : "Blog published successfully"
      );

      setTimeout(() => {
        let link = linkState ? linkState : "/dashboard/blogs";
        navigate(link);
      }, 1300);
    },
    onSettled: () => {},
  });

  // console.log(data);

  const publishBlogSubmitHandler = async (e) => {
    e.preventDefault();

    let bannerUrl = "";
    // console.log(banner);

    if (!banner) {
      return toast.error("Please add a banner image for your blog");
    }
    if (!title.length) {
      return toast.error("Please write a title for your blog");
    }
    if (!tags.length) {
      return toast.error(
        "Please add some tags to rank and search your blog or you forget to click enter"
      );
    }
    if (!des.length) {
      return toast.error("Please write a short description for your blog");
    }

    bannerUrl = isBackendBanner ? "" : await upload(banner);
    // bannerUrl = "";

    let imageUrl = isBackendBanner ? blogInputs.banner : bannerUrl;

    mutate({
      title,
      tags,
      content,
      banner: imageUrl,
      des,
      blogId: blogId,
    });
  };

  /*======================= DES CHANGE HANDLER ======================== */

  const desChangeHandler = (e) => {
    setBlogInputs((prevState) => ({
      ...prevState,
      des: e.target?.value?.slice(0, characterLimit),
    }));
  };
  // console.log(character, "in");

  /*======================= DES KEY DOWN HANDLER ======================== */

  const desKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  /*======================= TAGS KEY DOWN HANDLER ======================== */

  const tagsKeyDownHandler = (e) => {
    //|| e.keyCode === 188
    if (e.keyCode === 13) {
      e.preventDefault(); // so enter and comma not registered in that string

      const tagInput = e.target?.value
        .toLowerCase()
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "" && !tags.includes(tag.toLowerCase()));

      const uniqueTags = [...new Set(tagInput)];

      // console.log(uniqueTags);

      if (tags.length < tagLimit) {
        if (uniqueTags.length) {
          const newTags = uniqueTags.filter(
            (tag, i) => !tags.includes(tag.toLowerCase())
          );

          setBlogInputs((prevState) => ({
            ...prevState,
            tags: [...tags, ...newTags].slice(0, tagLimit),
          }));
        }
      } else {
        toast.error(`You can only add max ${tagLimit} tags`);
      }

      e.target.value = "";
    }
  };

  /*======================= JSX  ======================== */

  return (
    <AnimationWrapper>
      <section className="w-screen  grid items-center lg:grid-cols-2 pt-12 pb-5 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-[2] lg:top-[120px] top-[90px]"
          onClick={changePageHandler}
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="max-w-[550px] center">
          <h2 className="text-dark-grey mb-1">Preview</h2>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img
              src={
                isBackendBanner
                  ? blogInputs.banner
                  : banner && URL.createObjectURL(banner)
              }
              alt="banner"
            />
          </div>
          <h1
            className="text-4xl font-medium mt-2 leading-tight line-clamp-2
          "
          >
            {title}
          </h1>
          <p className="font-gelasio line-clamp-3 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>
        <form className="border-grey lg:border lg:pl-8 p-4">
          <label
            className="text-dark/80 mb-2 mt-8 block tracking-wider uppercase"
            htmlFor="title"
          >
            Blog Title
          </label>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            name="title"
            className="input-box pl-4 placeholder:text-black/50"
            onChange={(e) =>
              setBlogInputs((prevState) => ({
                ...prevState,
                title: e.target.value,
              }))
            }
          />
          <label
            className="text-dark/80 mb-2 mt-8 block tracking-wider uppercase"
            htmlFor="des"
          >
            A Short Description
          </label>
          <textarea
            name="des"
            id="des"
            cols="30"
            rows="2"
            maxLength={characterLimit + 1}
            placeholder={`Write a short description of your blog ( max: ${characterLimit} )`}
            className="input-box pl-4 placeholder:text-black/50 resize-none leading-7"
            onChange={desChangeHandler}
            onKeyDown={desKeyDownHandler}
            defaultValue={des}
          ></textarea>
          <p className="mt-1 mr-6 text-dark-grey text-sm text-right ">{`Character Limit - ${
            characterLimit - des.length
          }`}</p>
          <label
            className="text-dark/80 mb-2 mt-8 block tracking-wider uppercase"
            htmlFor="title"
          >
            Tags for Search Your Blog ( {`${tagLimit} / ${tags.length}`} )
          </label>
          <div className="relative input-box pl-1 pt-1 pr-1  pb-3">
            <input
              type="text"
              placeholder="Tags e.g- CSS, React, Node.js (max: 10)"
              name="title"
              className="input-box block bg-white pl-4 placeholder:text-black/50 focus:bg-white mb-3"
              onKeyDown={tagsKeyDownHandler}
            />
            <div className="flex flex-wrap gap-3">
              {tags.length > 0 &&
                tags.map((tag, i) => {
                  return <Tags key={i} tagIndex={i} tag={tag} />;
                })}
            </div>
          </div>
          <button
            type="submit"
            className="btn-dark center block disabled:bg-black/40 max-w-[200px] w-[160px] px-8 mt-10 mb-6"
            disabled={isPending ? true : false}
            onClick={publishBlogSubmitHandler}
          >
            {isPending || isLoading ? "Publishing..." : "Publish"}
          </button>
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default PublishBlogForm;

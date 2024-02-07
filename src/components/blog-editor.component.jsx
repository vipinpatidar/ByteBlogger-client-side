import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { makeRequest } from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../context/editor.context";
import EditorJs from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColorThemeState } from "../context/colorTheme.context";
import defaultBannerLight from "../imgs/blog banner light.png";
import defaultBannerDark from "../imgs/blog banner dark.png";
import useImageUploader from "../hook/useImageUploader";

const BlogEditor = ({
  changePageHandler,
  isBlogPending,
  blogData,
  blogError,
  blogId,
  linkState,
}) => {
  const {
    blogInputs,
    blogInputs: { title, banner, content, tags, des },
    setBlogInputs,
  } = useContext(EditorContext);

  const queryClient = useQueryClient();
  const { theme } = ColorThemeState();
  const [isLoading, error, getUploadedImg] = useImageUploader();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // console.log(blogInputs);
  const runOnce = useRef(false);

  const navigate = useNavigate();

  const isBackendBanner =
    typeof blogInputs.banner === "string" &&
    blogInputs.banner?.includes("/vipinpatidar5/");

  /*======================= SET EDITOR AND IT DATA ======================== */

  const [editorInstance, setEditorInstance] = useState(null);
  const [editorIsReady, setEditorIsReady] = useState(false);

  useEffect(() => {
    if (!runOnce.current) {
      const newEditorInstance = new EditorJs({
        holder: "textEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Let's write an awesome story",
        onReady: () => {
          setEditorIsReady(true);
          console.log("Editor.js is ready to work!");
        },
      });

      setEditorInstance(newEditorInstance);
      runOnce.current = true;
    }
  }, [content, blogId]);

  useEffect(() => {
    const updateEditorContent = () => {
      if (!isBlogPending && !blogError && blogData && editorIsReady) {
        // Use editorInstance instead of newEditorInstance
        if (editorInstance.isReady) {
          editorInstance.save().then((data) => {
            data?.blocks?.push(...content[0].blocks);
            editorInstance.clear(); // Clear the editor content
            editorInstance.render(data);
          });
        }
      }
    };
    updateEditorContent();
  }, [
    blogData,
    content,
    editorInstance,
    isBlogPending,
    blogError,
    editorIsReady,
  ]);

  /*====================== SET BANNER IMAGE HANDLER ======================== */

  const bannerUploadChangeHandler = (e) => {
    let img = e.target.files[0];
    if (img) {
      setBlogInputs((prevState) => ({ ...prevState, banner: img }));
      // console.log(img);
    }
  };

  /*===================== STOP ENTER KEY ON HEADING HANDLER ====================== */

  const handleEnterKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  /*======================= TITLE CHANGE HANDLER ======================== */

  const handleTitleChange = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    setBlogInputs((prevState) => ({ ...prevState, title: textarea.value }));
  };

  /*======================= CHECK BEFORE PUBLISH HANDLER ======================== */

  const publishBlogHandler = async () => {
    if (!blogInputs.banner) {
      return toast.error("Please Upload a banner before publishing.");
    }
    if (!blogInputs.title) {
      return toast.error("Please write blog title before publishing.");
    }

    if (editorIsReady) {
      editorInstance.save().then((data) => {
        if (data?.blocks?.length === 0) {
          return toast.error(
            "Please Write some story to editor before publishing."
          );
        } else {
          // console.log(data.blocks);
          setBlogInputs((prevState) => ({ ...prevState, content: data }));
          changePageHandler();
        }
      });
    }
  };
  // console.log(blogInputs.content);

  /*======================= UPLOAD IMAGE ============================== */

  const upload = async (image) => {
    try {
      const UploadedImg = await getUploadedImg(image);
      // console.log(UploadedImg, "image url");
      if (UploadedImg) {
        return UploadedImg;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      const err = error.response?.data?.error || "Image upload failed.";
      toast.error(err);
    }
  };

  /*======================= SAVING DRAFT ======================== */

  const { isPending, mutate, data } = useMutation({
    mutationFn: (blogData) => {
      return makeRequest.post("/blog/create-blog", blogData);
    },
    onError: (error) => {
      console.log(error);
      const err =
        error.response.data.error ||
        "Opps! Something went wrong. Please try again.";
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
          ? "Draft Updated successfully"
          : "Draft saved successfully"
      );
      setTimeout(() => {
        const link = linkState
          ? linkState?.includes("adminDashboard")
            ? `${linkState}&tab=draft`
            : `${linkState}?tab=draft`
          : "/dashboard/blogs?tab=draft";

        navigate(link);
      }, 1300);
    },
  });

  const saveDraftSubmitHandler = async (e) => {
    e.preventDefault();
    let bannerUrl = "";
    let contentData = [];

    if (!banner) {
      return toast.error("Please add a banner image before saving as draft");
    }
    if (!title.length) {
      return toast.error("Please write a title before saving as draft");
    }

    bannerUrl = isBackendBanner ? "" : await upload(banner);

    if (editorIsReady) {
      const contentObj = await editorInstance.save();
      if (contentObj?.blocks?.length > 0) {
        contentData = contentObj;
      }
    }

    let imageUrl = isBackendBanner ? blogInputs.banner : bannerUrl;

    mutate({
      title,
      content: contentData,
      banner: imageUrl,
      des,
      tags,
      draft: true,
      blogId: blogId,
    });

    // bannerUrl = "";
  };

  /*======================= JSX ======================== */

  return (
    <div className="py-12 md:py-16">
      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="mx-auto w-full max-w-[900px]">
            <div className="relative aspect-video hover:opacity-80 border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={
                    isBackendBanner
                      ? blogInputs.banner
                      : blogInputs.banner
                      ? URL.createObjectURL(blogInputs.banner)
                      : theme === "light"
                      ? defaultBannerLight
                      : defaultBannerDark
                  }
                  alt="banner"
                  className="z-10"
                />
                <input
                  type="file"
                  name="banner"
                  id="uploadBanner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={bannerUploadChangeHandler}
                />
              </label>
            </div>
            <textarea
              name="title"
              id="title"
              placeholder="Blog Title"
              className="text-4xl font-medium w-full outline-none resize-none mt-10 leading-tight placeholder:opacity-50 h-20 bg-white"
              onKeyDown={handleEnterKeyDown}
              onChange={handleTitleChange}
              defaultValue={blogInputs.title}
            ></textarea>

            <hr className="w-full opacity-20 mt-4" />

            <div id="textEditor" className="font-gelasio mb-4"></div>
          </div>
        </section>
      </AnimationWrapper>
      <nav className="navbar px-0 pr-8 border-b-0 mx-auto z-0 max-w-[900px] border-t-2">
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {blogInputs.title.length > 0 ? blogInputs.title : "New Blog"}
        </p>

        <div className="flex gap-10 ml-auto items-center">
          <button className="btn-dark py-3" onClick={publishBlogHandler}>
            Publish
          </button>
          <button
            className="btn-light flex items-center disabled:bg-grey/40 gap-2 rounded-none up"
            onClick={saveDraftSubmitHandler}
            disabled={isPending ? true : false}
          >
            <i className="fi fi-rr-folder-download"></i>{" "}
            {isPending || isLoading ? "Saving Draft..." : "Save Draft"}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BlogEditor;

// import tools for editor js functionality
import Image from "@editorjs/image";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import { CodeWithLanguageTool } from "./codewithlanguagetool.jsx";

const uploadImageByURL = async (url) => {
  try {
    // Verify that the URL is valid and fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Image URL fetch failed");
    }

    // If the response is successful, return the URL in the required format
    return {
      success: 1,
      file: {
        url, // The URL of the image
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: 0,
      message: "Failed to upload image from URL.",
    };
  }
};

const upload = async (image) => {
  try {
    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/jpg"
    ) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.url.toString();
    }
  } catch (error) {
    console.log(error);
    const err = error?.response?.data?.error || "Image upload failed.";
  }
};

const uploadImageByFile = async (e) => {
  return upload(e).then((url) => {
    if (url) {
      let newUrl = url;

      return {
        success: 1,
        file: { url: newUrl },
      };
    }
  });
};
// http://localhost:3000/uploads/1702286973954-formCover2.jpg

export const tools = {
  embed: Embed,
  link: Link,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  list: {
    class: List,
    inlineToolBar: true,
  },
  marker: Marker,
  quote: {
    class: Quote,
    inlineToolBar: true,
  },
  code: CodeWithLanguageTool,
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  inlineCode: InlineCode,
};

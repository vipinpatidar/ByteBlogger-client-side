// import tools for editor js functionality
import Image from "@editorjs/image";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import Code from "@editorjs/code";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import { makeRequest } from "../utils/axios";

const uploadImageByURL = (e) => {
  console.log(e);
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (error) {
      reject(error);
    }
  });

  return link.then((url) => {
    console.log(url);
    return {
      success: 1,
      file: { url },
    };
  });
};

const upload = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await makeRequest.post("/upload", formData);
    return res.data;
  } catch (error) {
    console.log(error);
    const err = error.response.data.error || "Image upload failed.";
  }
};

const uploadImageByFile = async (e) => {
  return upload(e).then((url) => {
    if (url) {
      let newUrl = `${import.meta.env.VITE_HOST_URL}/uploads/${url}`;

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
  code: Code,
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  inlineCode: InlineCode,
};

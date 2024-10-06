import { createContext, useEffect, useState } from "react";
import { getFromSession } from "../common/session";

export const EditorContext = createContext({
  blogInputs: {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: "",
  },
  setBlogInputs: () => {},
});

const EditorContextProvider = ({ children }) => {
  const [blogInputs, setBlogInputs] = useState({
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: "",
  });

  const context = {
    blogInputs,
    setBlogInputs,
  };
  return (
    <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
  );
};

export default EditorContextProvider;

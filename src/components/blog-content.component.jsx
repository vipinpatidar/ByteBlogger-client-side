import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  solarizedlight,
  tomorrow,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { ColorThemeState } from "../context/colorTheme.context";

const Image = ({ url, caption }) => {
  return (
    <div>
      <img src={url} alt="blog image" />
      {caption && (
        <p className="w-full text-center my-3 md:mb-10 text-base text-dark-grey">
          {caption}
        </p>
      )}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple/10 p-5 pl-8 border-l-4 border-purple">
      <q className="text-xl leading-8 md:text-2xl">
        {quote.replace(/<[^>]*(>|$)|"|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, "")}
      </q>
      <p className="w-full text-purple text-base">{caption}</p>
    </div>
  );
};

const List = ({ style, items }) => {
  return (
    <ol
      className={`pl-5 ${style === "ordered" ? "list-decimal" : "list-disc"}`}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className="my-3 font-inter text-[18px] leading-[1.7] font-normal"
          dangerouslySetInnerHTML={{ __html: item }}
        ></li>
      ))}
    </ol>
  );
};

const BlogCodeSnippet = ({ codeString, language }) => {
  const [copySuccess, setCopySuccess] = useState("");
  const { theme } = ColorThemeState();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(codeString)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
      })
      .catch((err) => {
        setCopySuccess("Failed to copy");
      });
  };

  return (
    <div className="relative group">
      {/* Syntax Highlighter */}
      <SyntaxHighlighter
        language={language?.toLowerCase()}
        style={theme === "dark" ? tomorrow : solarizedlight}
        showLineNumbers
        wrapLines
        wrapLongLines
      >
        {codeString}
      </SyntaxHighlighter>

      {/* Copy Button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-2 hidden right-2 bg-blue-500 text-[#fff] px-3 py-1 text-sm rounded hover:bg-blue-400 group-hover:block"
      >
        {copySuccess ? copySuccess : "Copy"}
      </button>
    </div>
  );
};

const BlogContent = ({ block }) => {
  let { type, data } = block;

  if (type === "paragraph") {
    return (
      <p
        className="font-inter text-[18px] leading-[1.7] font-normal"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></p>
    );
  }

  if (type === "header") {
    if (data.level === 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    } else if (data.level === 2) {
      return (
        <h2
          className="text-4xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h2>
      );
    } else if (data.level === 4) {
      return (
        <h4
          className="text-2xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h4>
      );
    }
  }

  if (type === "image") {
    return <Image url={data.file.url} caption={data.caption} />;
  }

  if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }
  if (type === "list") {
    return <List style={data.style} items={data.items} />;
  }

  if (type === "code") {
    return (
      <BlogCodeSnippet
        codeString={data.code} // Pass the code content correctly as a prop
        language={data.language} // Set the language
      />
    );
  }
  // if (type === "code") {
  //   return (
  //     <div className="bg-grey p-5 pl-8 my-4 rounded-sm border-l-4 border-black">
  //       <code
  //         className="text-black whitespace-pre-wrap"
  //         dangerouslySetInnerHTML={{ __html: data.code }}
  //       ></code>
  //     </div>
  //   );
  // }

  if (type === "link") {
    return (
      <a
        href={data.link}
        target="_blank"
        className="underline my-4 font-inter hover:text-blue-500 text-[16px] leading-[1.7] font-normal"
      >
        {data.link}
      </a>
    );
  }
  return <div>BlogContent</div>;
};

export default BlogContent;

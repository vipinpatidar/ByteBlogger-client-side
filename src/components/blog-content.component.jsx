import React from "react";

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
          className="my-3"
          dangerouslySetInnerHTML={{ __html: item }}
        ></li>
      ))}
    </ol>
  );
};

const BlogContent = ({ block }) => {
  let { type, data } = block;

  if (type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
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
      <div className="bg-grey p-5 pl-8 my-4 rounded-sm border-l-4 border-black">
        <code
          className="text-black whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: data.code }}
        ></code>
      </div>
    );
  }

  if (type === "link") {
    return (
      <a href={data.link} target="_blank" className="underline my-4">
        {data.link}
      </a>
    );
  }
  return <div>BlogContent</div>;
};

export default BlogContent;

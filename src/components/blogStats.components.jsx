import React from "react";

const BlogStats = ({ stats }) => {
  return (
    <div className="flex gap-1">
      {Object.keys(stats).map((info, idx) => {
        return !info.includes("parent") ? (
          <div
            key={idx}
            className="flex flex-col items-center w-full h-full justify-center pt-4 px-6"
          >
            <h1 className="text-xl lg:text-2xl mb-1">
              {stats[info].toLocaleString()}
            </h1>
            <p className="capitalize text-dark-grey">{info.split("_")[1]}</p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
};

export default BlogStats;

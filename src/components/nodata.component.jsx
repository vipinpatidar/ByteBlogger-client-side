import React from "react";

const NoDataMessage = ({ message, error, styles = undefined }) => {
  return (
    <div
      className={`${
        styles
          ? styles
          : "text-center w-full p-4 text-red rounded-full bg-grey/50 mt-32"
      }`}
    >
      <p className="text-xl">
        {error
          ? error?.response?.data?.error ||
            "Opps! Something went wrong. Please try again."
          : message}
      </p>
    </div>
  );
};

export default NoDataMessage;

import React from "react";
import { Link } from "react-router-dom";
import { ColorThemeState } from "../context/colorTheme.context";
import fullLogoLight from "../imgs/bytes-white.png";
import fullLogoDark from "../imgs/bytes-black.png";
import errorImgLight from "../imgs/404-light.png";
import errorImgDark from "../imgs/404-dark.png";

const Error404 = () => {
  const { theme } = ColorThemeState();
  return (
    <section className="h-cover relative p-8 flex flex-col items-center gap-14 text-center">
      <img
        src={theme === "light" ? errorImgDark : errorImgLight}
        alt="error 404 image"
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8">
        The page you are looking for does not exists.
      </p>
      <Link className="btn-dark px-7 py-3 -mt-8" to={"/"}>
        GO TO HOME
      </Link>
      <div className="mt-auto">
        <div className="flex items-center justify-center gap-3">
          <img
            src={theme === "light" ? fullLogoDark : fullLogoLight}
            alt="full logo image"
            className="h-16 w-16 object-contain block select-none"
          />
          <h1 className="text-2xl font-medium">ByteBlog</h1>
        </div>
        <p className="mt-4 text-dark-grey">
          Read millions of stories around the world.
        </p>
      </div>
    </section>
  );
};

export default Error404;

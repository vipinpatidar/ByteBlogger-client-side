import React from "react";
import { Link } from "react-router-dom";
import { getFullDayFormate } from "../common/date";

const AboutUser = ({ className, bio, socialLinks, joinedAt }) => {
  return (
    <div className={`md:w-[90%] md:mt-7 text-center ${className}`}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Nothing to read here"}
      </p>

      <div className="flex gap-x-5 gap-y-2 flex-wrap my-7 items-center text-dark-grey justify-center">
        {Object.keys(socialLinks).map((key) => {
          let link = socialLinks[key];

          return link ? (
            <Link to={link} target="_blank" key={key}>
              <i
                className={`fi text-2xl hover:text-black ${
                  key !== "website"
                    ? `fi-brands-${key.toLowerCase()}`
                    : "fi-rs-globe"
                }`}
              ></i>
            </Link>
          ) : (
            ""
          );
        })}
      </div>
      <p className="text-xl mt-2 leading-7 text-dark-grey ">
        Joined on {getFullDayFormate(joinedAt)}
      </p>
    </div>
  );
};

export default AboutUser;

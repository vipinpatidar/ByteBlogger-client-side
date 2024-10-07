import React, { useEffect, useRef, useState } from "react";

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
  activeTabRef,
  setChangeBoolean = undefined,
}) => {
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
  const activeTabLineRef = useRef();
  const [width, setWidth] = useState(window.innerWidth);

  const changePageHandler = (btn, index) => {
    setInPageNavIndex(index);
    let { offsetWidth, offsetLeft } = btn;

    if (index === 0 && setChangeBoolean !== undefined) {
      setChangeBoolean(false);
    } else if (index === 1 && setChangeBoolean !== undefined) {
      setChangeBoolean(true);
    }

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";
  };

  useEffect(() => {
    if (width > 766 && inPageNavIndex !== defaultActiveIndex) {
      changePageHandler(activeTabRef.current, defaultActiveIndex);
    }

    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWidth(window.innerWidth);
      });
    };
  }, [width]);

  //   console.log(children);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-gray flex flex-nowrap overflow-x-auto">
        {routes.map((route, index) => (
          <button
            ref={index === defaultActiveIndex ? activeTabRef : null}
            key={index}
            className={`p-4 px-4 md:px-5 capitalize font-medium ${
              inPageNavIndex === index ? "text-black " : "text-dark-grey "
            }
            ${defaultHidden.includes(route) ? " md:hidden" : " "}
            `}
            onClick={(e) => changePageHandler(e.target, index)}
          >
            {route}
          </button>
        ))}
        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 duration-300 border-dark-grey"
        />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;

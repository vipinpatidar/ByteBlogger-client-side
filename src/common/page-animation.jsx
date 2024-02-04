import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({
  children,
  keyValue,
  initialCSS = { opacity: 0 },
  animateCSS = { opacity: 1 },
  transition = { duration: 1 },
  className,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        key={keyValue}
        initial={initialCSS}
        animate={animateCSS}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;

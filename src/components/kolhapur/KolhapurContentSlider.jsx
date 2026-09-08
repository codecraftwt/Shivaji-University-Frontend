import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function KolhapurContentSlider({
  activeView,
  direction,
  overviewContent,
  attractionsContent,
}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const transitionConfig = prefersReducedMotion
    ? { duration: 0.15 }
    : {
        x: { type: "spring", stiffness: 260, damping: 28, mass: 0.75 },
        opacity: { duration: 0.25, ease: "easeOut" },
      };

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden relative">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={activeView}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionConfig}
          className="w-full flex-1 flex flex-col"
        >
          {activeView === "overview" ? overviewContent : attractionsContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

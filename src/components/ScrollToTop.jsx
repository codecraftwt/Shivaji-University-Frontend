import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[9999] w-12 h-12 flex items-center justify-center rounded-full bg-[#0B4C87]/90 hover:bg-[#FF7B12] text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md transition-colors duration-300 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 stroke-[3px] drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStrapiMediaUrl } from "../../lib/strapi";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Button from "../Button";

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 70, damping: 20 } 
  }
};

export default function HeroSection({ data }) {
  const slides = data?.slides || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return null; // Don't render anything if no slides are provided
  }

  const currentSlide = slides[currentIndex];
  const buttonText = currentSlide?.buttonText || "Admissions Open";
  const buttonLink = currentSlide?.buttonLink || "/admissions";
  const mediaUrl = currentSlide?.image ? getStrapiMediaUrl(currentSlide.image) : "https://placehold.co/1920x800/333/666?text=University+Campus";

  return (
    <>
      <section id="hero-section" className="relative z-0 w-full h-[480px] sm:h-[540px] md:h-[600px] lg:h-[650px] bg-[#0F172A] overflow-hidden group/hero font-sans">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Infinite Slow Zoom Background Image */}
            <motion.div
              animate={{ scale: [1, 1.1] }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="w-full h-full"
            >
              <img
                src={mediaUrl}
                alt={currentSlide?.heading || "Hero Background"}
                className="w-full h-full object-cover opacity-60"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 z-0 pointer-events-none"></div>

        {/* Main Content Area */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ staggerChildren: 0.2 }}
              className="max-w-4xl"
            >
              <motion.p variants={textVariants} className="text-[#FF7B12] text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-[2px] sm:tracking-[3px] mb-2 sm:mb-4 drop-shadow-md">
                {currentSlide?.subheading}
              </motion.p>
              <motion.h1 
                variants={textVariants} 
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] mb-5 sm:mb-8 tracking-tight drop-shadow-lg whitespace-pre-line"
              >
                {currentSlide?.heading}
              </motion.h1>
              <motion.div variants={textVariants} className="pt-1 sm:pt-2">
                <Button to={buttonLink} className="px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base inline-flex items-center justify-center gap-2">
                  {buttonText}
                  <ArrowRight size={18} />
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-[#FF7B12] transition-all duration-300 opacity-70 sm:opacity-0 group-hover/hero:opacity-100 backdrop-blur-sm"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-[#FF7B12] transition-all duration-300 opacity-70 sm:opacity-0 group-hover/hero:opacity-100 backdrop-blur-sm"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Carousel Controls */}
        {slides.length > 1 && (
          <div className="absolute bottom-16 sm:bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#FF7B12] w-6 sm:w-8' : 'bg-white/50 hover:bg-white w-2.5 sm:w-3'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

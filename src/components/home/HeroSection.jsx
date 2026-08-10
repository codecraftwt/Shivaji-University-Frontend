import { motion } from "framer-motion";
import { getStrapiMediaUrl } from "../../lib/strapi";
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
  const subheading = data?.subheading || "Shaping Bright Minds Through Quality Education";
  const heading = data?.heading || "Shivaji University: \nEmpowering Future Generations";
  const buttonText = data?.buttonText || "Admissions Open";
  const buttonLink = data?.buttonLink || "/admissions";
  const mediaUrl = data?.backgroundImage ? getStrapiMediaUrl(data.backgroundImage) : "https://placehold.co/1920x800/333/666?text=University+Campus";

  return (
    <>
      <section id="hero-section" className="relative z-0 w-full h-[600px] bg-[#0F172A] overflow-hidden">
        {/* Infinite Slow Zoom Background Image */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={mediaUrl}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-0"></div>

        {/* Main Content Area */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
            className="max-w-4xl"
          >
            <motion.p variants={textVariants} className="text-[#FF7B12] text-sm md:text-base font-bold uppercase tracking-[3px] mb-3 drop-shadow-md">
              {subheading}
            </motion.p>
            <motion.h1 variants={textVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-lg whitespace-pre-line">
              {heading}
            </motion.h1>
            <motion.div variants={textVariants} className="pt-2">
              <Button to={buttonLink} className="px-8 py-3.5 text-lg inline-flex items-center justify-center gap-2">
                {buttonText}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </motion.div>
          </motion.div>
        </div>

      </section>
    </>
  );
}

import { motion } from "framer-motion";
import * as HeroIcons from "@heroicons/react/24/outline";

// Fallback data in case the API is empty or fails
const defaultLinks = [
  { title: "NIRF", iconName: "ChartBarIcon", url: "#" },
  { title: "AIU", iconName: "GlobeAltIcon", url: "#" },
  { title: "National Education Policy", iconName: "BookOpenIcon", url: "#" },
  { title: "Our Programs", iconName: "AcademicCapIcon", url: "#" },
  { title: "IT Services", iconName: "ComputerDesktopIcon", url: "#" },
  { title: "Examinations", iconName: "DocumentCheckIcon", url: "#" },
  { title: "Student Design Center", iconName: "LightBulbIcon", url: "#" },
  { title: "Vice Chancellor", iconName: "UserGroupIcon", url: "#" },
];

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.4 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 }
  }
};

export default function QuickLinksRow({ data }) {
  const links = data?.links?.length
    ? data.links.map((link) => ({
        title: link.title,
        iconName: link.iconName,
        url: link.url || "#",
      }))
    : defaultLinks;

  return (
    <div className="relative z-20 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 -mt-14 sm:-mt-20 md:-mt-24">
      {/* Container with Edge-Fading Scroll Mask */}
      <div 
        className="relative w-full"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)"
        }}
      >
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "50px" }}
          className="flex gap-3 sm:gap-4 lg:gap-5 justify-start xl:justify-center overflow-x-auto pb-6 pt-3 px-2 scrollbar-hide snap-x"
        >
          {links.map((link, i) => {
            const IconComponent = HeroIcons[link.iconName] || HeroIcons.LinkIcon;

            return (
              <motion.a
                key={i}
                href={link.url || "#"}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.03 }}
                className="
                  snap-start shrink-0 w-[125px] sm:w-[145px] md:w-[150px] h-[135px] sm:h-[145px] md:h-[150px] relative overflow-hidden group
                  flex flex-col items-center justify-start text-center p-3.5 sm:p-5 cursor-pointer
                  rounded-2xl transition-all duration-300 ease-out
                  bg-white border border-gray-100 
                  shadow-md sm:shadow-lg hover:shadow-[0_20px_40px_rgba(30,144,255,0.15)]
                "
              >
                {/* Dynamic Glowing Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/5 to-[#FF7B12]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Subtle Orange Bottom Border Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF7B12] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 scale-x-0 group-hover:scale-x-100"></div>

                <div className="relative w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E90FF] mb-2.5 sm:mb-3.5 shadow-sm group-hover:bg-[#FF7B12] group-hover:border-[#FF7B12] group-hover:text-white transition-all duration-500 group-hover:rotate-[360deg] group-hover:shadow-lg z-10">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>

                <span className="relative z-10 text-[11px] sm:text-[12px] font-bold text-[#0B4C87] uppercase tracking-[0.5px] sm:tracking-[1px] leading-tight group-hover:text-[#1a1a2e] transition-colors duration-300 line-clamp-2">
                  {link.title}
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

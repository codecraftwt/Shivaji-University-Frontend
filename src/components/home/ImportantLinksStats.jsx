import { useEffect, useRef, useState } from "react";
import { getStrapiMediaUrl } from "../../lib/strapi";
import { useInView, animate } from "framer-motion";

const defaultLinks = [
  { name: "NAAC", url: "#", imageUrl: "https://inherent-duck.jurassic.ninja/wp-content/uploads/2024/10/naac.jpg" },
  { name: "NCTE", url: "#", imageUrl: "https://inherent-duck.jurassic.ninja/wp-content/uploads/2024/10/ncte.png" },
  { name: "e-Samadhan", url: "#", imageUrl: "https://inherent-duck.jurassic.ninja/wp-content/uploads/2024/10/E-samadhan_logo_new.png" },
  { name: "NEP2020", url: "#", imageUrl: "https://inherent-duck.jurassic.ninja/wp-content/uploads/2024/10/nep2020.jpg" },
  { name: "Academic Bank Credit", url: "#", imageUrl: "https://inherent-duck.jurassic.ninja/wp-content/uploads/2024/10/abc.png" },
  { name: "NAD", url: "#", imageUrl: "https://inherent-duck.jurassic.ninja/wp-content/uploads/2024/10/nad-logo-new.png" },
];

const defaultStats = [
  { value: "34", label: "Departments" },
  { value: "2", label: "Schools" },
  { value: "15", label: "Chairs" },
  { value: "26", label: "Centers" },
  { value: "297", label: "Affiliated Colleges" },
  { value: "853", label: "Campus in Acres" },
];

function StatCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  const numMatch = String(value).match(/(\d+)/);
  const numValue = numMatch ? parseInt(numMatch[0], 10) : 0;
  const suffix = numMatch ? String(value).substring(numMatch[0].length + numMatch.index) : String(value);
  const prefix = numMatch ? String(value).substring(0, numMatch.index) : "";

  useEffect(() => {
    if (isInView && numValue > 0) {
      const controls = animate(0, numValue, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (v) => setDisplayValue(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [isInView, numValue]);

  if (numValue === 0 && !numMatch) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

export default function ImportantLinksStats({ data }) {
  const links = data?.importantLinks?.length
    ? data.importantLinks.map((l) => ({
        name: l.name,
        url: l.url || "#",
        imageUrl: l.image ? getStrapiMediaUrl(l.image) : (l.imageUrl ? getStrapiMediaUrl(l.imageUrl) : ""),
      }))
    : defaultLinks;

  const stats = data?.stats?.length
    ? data.stats.map((s) => ({ value: s.value, label: s.label }))
    : defaultStats;

  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrameId;
    let isHovered = false;
    
    // Speed: pixels per frame (adjust for slower/faster continuous scroll)
    const speed = 0.8; 

    const scroll = () => {
      if (!isHovered) {
        carousel.scrollLeft += speed;
        // If we reach the end, wrap back to the beginning smoothly
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1) {
          carousel.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);

    // Start the animation loop
    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [links]);

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#007bff] mb-6 sm:mb-10">Other Important Links</h2>
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide mb-8 sm:mb-12 py-4 sm:py-6 px-2 sm:px-4 select-none"
        >
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target={link.url && link.url !== "#" ? "_blank" : "_self"}
              rel="noreferrer"
              className="group relative flex items-center justify-center shrink-0 bg-white border border-gray-100 rounded-2xl p-4 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 w-48 h-32 sm:w-64 sm:h-44"
              title={link.name}
            >
              {/* Double Border Corner Design on Hover */}
              
              {/* Top-Left Corners (Blue #1E90FF) */}
              <div className="absolute top-[-6px] left-[-6px] w-8 sm:w-10 h-8 sm:h-10 border-t-[3px] border-l-[3px] border-[#1E90FF] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none rounded-tl"></div>
              <div className="absolute top-[-12px] left-[-12px] w-12 sm:w-14 h-12 sm:h-14 border-t-[3px] border-l-[3px] border-[#1E90FF]/50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-75 pointer-events-none rounded-tl"></div>

              {/* Bottom-Right Corners (Orange #FF7B12) */}
              <div className="absolute bottom-[-6px] right-[-6px] w-8 sm:w-10 h-8 sm:h-10 border-b-[3px] border-r-[3px] border-[#FF7B12] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none rounded-br"></div>
              <div className="absolute bottom-[-12px] right-[-12px] w-12 sm:w-14 h-12 sm:h-14 border-b-[3px] border-r-[3px] border-[#FF7B12]/50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-75 pointer-events-none rounded-br"></div>

              {link.imageUrl ? (
                <img
                  src={link.imageUrl}
                  alt={link.name || "logo"}
                  loading="lazy"
                  className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-xs sm:text-sm font-semibold text-gray-400">{link.name || "Logo"}</span>
              )}
            </a>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-6 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative rounded-2xl bg-white transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_30px_-10px_rgba(30,144,255,0.3)] overflow-hidden flex flex-col justify-center min-h-[110px] sm:min-h-[140px] border border-gray-100 p-4 sm:p-6 items-center text-center hover:border-[#1E90FF]/40"
            >
              <div className="text-2xl sm:text-3xl font-black text-[#1E90FF] mb-1 sm:mb-2 group-hover:text-[#FF7B12] transition-colors duration-500 drop-shadow-sm group-hover:scale-110">
                <StatCounter value={stat.value} />
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-gray-500 tracking-wider uppercase leading-snug group-hover:text-gray-900 transition-colors duration-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

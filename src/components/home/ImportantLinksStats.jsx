import { useEffect, useRef } from "react";
import { getStrapiMediaUrl } from "../../lib/strapi";

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
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#007bff] mb-10">Other Important Links</h2>
        <div
          ref={carouselRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide mb-12 py-6 px-4 select-none"
        >
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target={link.url && link.url !== "#" ? "_blank" : "_self"}
              rel="noreferrer"
              className="group relative flex items-center justify-center shrink-0 bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 w-64 h-44"
              title={link.name}
            >
              {/* Double Border Corner Design on Hover */}
              
              {/* Top-Left Corners (Blue #1E90FF) */}
              <div className="absolute top-[-6px] left-[-6px] w-10 h-10 border-t-[3px] border-l-[3px] border-[#1E90FF] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none rounded-tl"></div>
              <div className="absolute top-[-12px] left-[-12px] w-14 h-14 border-t-[3px] border-l-[3px] border-[#1E90FF]/50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-75 pointer-events-none rounded-tl"></div>

              {/* Bottom-Right Corners (Orange #FF7B12) */}
              <div className="absolute bottom-[-6px] right-[-6px] w-10 h-10 border-b-[3px] border-r-[3px] border-[#FF7B12] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none rounded-br"></div>
              <div className="absolute bottom-[-12px] right-[-12px] w-14 h-14 border-b-[3px] border-r-[3px] border-[#FF7B12]/50 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-75 pointer-events-none rounded-br"></div>

              {link.imageUrl ? (
                <img
                  src={link.imageUrl}
                  alt={link.name || "logo"}
                  loading="lazy"
                  className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-400">{link.name || "Logo"}</span>
              )}
            </a>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-center min-h-[140px]"
            >
              {/* Premium Top Line Accent with gradient - slides down on hover */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#1E90FF] to-[#FF7B12] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

              {/* Unique corner gradient dot decoration */}
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#FF7B12] transition-colors duration-300"></div>
              
              <div className="text-3xl font-extrabold text-[#007bff] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase leading-snug group-hover:text-gray-700 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

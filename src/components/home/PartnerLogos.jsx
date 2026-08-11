import { getStrapiMediaUrl } from "../../lib/strapi";
import { useState, useRef } from "react";

const defaultPartners = [
  { name: "Skill India", imageUrl: "" },
  { name: "Swachh Bharat", imageUrl: "" },
  { name: "MAKE IN INDIA", imageUrl: "" },
  { name: "Digital India", imageUrl: "" },
];

export default function PartnerLogos({ data }) {
  const partners = data?.partners?.length
    ? data.partners.map((p) => ({
        name: p.name,
        imageUrl: p.image || p.imageUrl || ""
      })).filter((p) => p.name || p.imageUrl)
    : defaultPartners;

  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollWidth <= clientWidth) {
      if (activeIndex !== 0) setActiveIndex(0);
      return;
    }
    const maxScroll = scrollWidth - clientWidth;
    const scrollPercentage = Math.max(0, Math.min(1, scrollLeft / maxScroll));
    const index = Math.round(scrollPercentage * (partners.length - 1));
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    
    const targetScroll = (index / (partners.length - 1)) * maxScroll;
    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[3px] text-[#ff7f00]">
            Trusted Partners
          </span>
          <h2 className="mt-1.5 text-2xl font-bold text-[#005bb5] sm:text-3xl">
            Our Partners
          </h2>
          <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#ff7f00] to-[#005bb5]" />
        </div>

        {/* Mask for smooth edge fading on scroll */}
        <div 
          className="relative w-full"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
          }}
        >
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-nowrap items-center justify-start lg:justify-center gap-6 sm:gap-8 overflow-x-auto pb-6 pt-2 px-4 scrollbar-hide snap-x snap-mandatory sm:snap-proximity"
          >
          {partners.map((partner, i) => {
            const imgSrc = partner.imageUrl ? getStrapiMediaUrl(partner.imageUrl) : null;
            return imgSrc ? (
              <div
                key={i}
                title={partner.name}
                className="group relative flex h-36 w-[80vw] max-w-[280px] sm:h-32 sm:max-w-none sm:w-56 shrink-0 snap-center items-center justify-center rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,91,181,0.15)] overflow-hidden"
              >
                {/* Animated Gradient Border Reveal */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7B12] via-[#ffaa00] to-[#005bb5] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Inner White Card */}
                <div className="absolute inset-[3px] rounded-[14px] bg-white transition-all duration-500 flex items-center justify-center p-4">
                  <img
                    src={imgSrc}
                    alt={partner.name || "partner logo"}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.15]"
                  />
                </div>
              </div>
            ) : (
              <span key={i} className="font-bold text-gray-400 text-xl tracking-wider uppercase">
                {partner.name}
              </span>
            );
          })}
        </div>
        </div>

        {/* Pagination Dots (Mobile) */}
        <div className="mt-2 sm:hidden flex justify-center gap-2.5">
          {partners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-6 bg-[#ff7f00]" : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

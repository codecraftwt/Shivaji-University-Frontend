import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

const socialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 110 4 2 2 0 010-4z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

const brandBgColors = {
  facebook: "bg-[#1877F2] shadow-[#1877F2]/40",
  linkedin: "bg-[#0A66C2] shadow-[#0A66C2]/40",
  instagram: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-[#dc2743]/40",
  youtube: "bg-[#CD201F] shadow-[#CD201F]/40",
  twitter: "bg-black shadow-black/40",
  x: "bg-black shadow-black/40",
};

export default function FloatingSocials({ socialLinks = [] }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Synchronize bottom offset with sidebar button when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!socialLinks || socialLinks.length === 0) return null;

  const validLinks = socialLinks.filter((s) => socialIcons[s.platform?.toLowerCase()]);
  if (validLinks.length === 0) return null;

  return (
    <>
      {/* ─── 1. Desktop Vertical Floating Bar (xl and above) ─── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[50] hidden xl:flex flex-col gap-4">
        {validLinks.map((s, i) => {
          const platformKey = s.platform?.toLowerCase() || "";
          const Icon = socialIcons[platformKey];
          
          let hoverBgClass = "hover:bg-gray-800";
          let hoverGlowClass = "hover:shadow-gray-500/50";

          if (platformKey === "facebook") {
            hoverBgClass = "hover:bg-[#1877F2]";
            hoverGlowClass = "hover:shadow-[#1877F2]/50";
          } else if (platformKey === "linkedin") {
            hoverBgClass = "hover:bg-[#0A66C2]";
            hoverGlowClass = "hover:shadow-[#0A66C2]/50";
          } else if (platformKey === "instagram") {
            hoverBgClass = "hover:bg-[#E4405F]";
            hoverGlowClass = "hover:shadow-[#E4405F]/50";
          } else if (platformKey === "youtube") {
            hoverBgClass = "hover:bg-[#CD201F]";
            hoverGlowClass = "hover:shadow-[#CD201F]/50";
          } else if (platformKey === "twitter" || platformKey === "x") {
            hoverBgClass = "hover:bg-black";
            hoverGlowClass = "hover:shadow-black/50";
          }

          return (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={`group relative w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/80 transition-all duration-300 ease-out hover:-translate-x-1 ${hoverBgClass} ${hoverGlowClass} hover:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] cursor-pointer`}
              aria-label={s.platform}
            >
              <span className="text-[#0B4C87] group-hover:text-white transition-colors duration-300 relative z-10 flex items-center justify-center">
                {Icon}
              </span>

              {/* Tooltip that slides out from the left */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold tracking-wide uppercase opacity-0 invisible translate-x-3 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                {s.platform}
                <div className="absolute top-1/2 right-0 translate-x-[90%] -translate-y-1/2 border-[5px] border-transparent border-l-gray-900"></div>
              </div>
            </a>
          );
        })}
      </div>

      {/* ─── 2. Mobile Radial Fan-out Social Ball (Fixed at Bottom-Right) ─── */}
      <div
        className={`xl:hidden fixed right-6 z-[9985] transition-all duration-300 ease-out ${
          hasScrolled ? "bottom-20" : "bottom-6"
        }`}
      >
        {/* Backdrop for closing when tapped outside */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[-1] bg-black/25 backdrop-blur-[2px]"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className="relative flex items-center justify-center">
          {/* Radial Pop-out Social Icons (Fans out Upward & to the Left: 88° to 182°) */}
          <AnimatePresence>
            {isMobileOpen &&
              validLinks.map((s, i) => {
                const platformKey = s.platform?.toLowerCase() || "";
                const Icon = socialIcons[platformKey];
                const bgClass = brandBgColors[platformKey] || "bg-[#005bb5] shadow-[#005bb5]/40";

                // Radial Coordinates along upward-left arc with comfortable radius
                const count = validLinks.length;
                const radius = 98; // Distance from center ball in px
                const startAngle = 88; // Almost straight UP
                const endAngle = 182; // Straight LEFT
                const angleDeg = count > 1 ? startAngle + ((endAngle - startAngle) / (count - 1)) * i : 135;
                const angleRad = (angleDeg * Math.PI) / 180;
                const targetX = Math.round(radius * Math.cos(angleRad)); // Negative value -> goes LEFT into viewport
                const targetY = Math.round(-radius * Math.sin(angleRad)); // Negative value -> goes UPWARDS

                return (
                  <motion.a
                    key={s.platform + i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                    animate={{ 
                      opacity: 1, 
                      x: targetX, 
                      y: targetY, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                        mass: 0.7,
                        delay: i * 0.03,
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: 0, 
                      y: 0, 
                      scale: 0.2,
                      transition: {
                        duration: 0.15,
                        delay: (count - 1 - i) * 0.02,
                      }
                    }}
                    onClick={() => setIsMobileOpen(false)}
                    className={`absolute w-10 h-10 rounded-full text-white ${bgClass} shadow-[0_6px_18px_rgba(0,0,0,0.28)] flex items-center justify-center border border-white/90 active:scale-90 transition-transform cursor-pointer`}
                    aria-label={s.platform}
                    title={s.platform}
                  >
                    <span className="flex items-center justify-center text-white">{Icon}</span>
                  </motion.a>
                );
              })}
          </AnimatePresence>

          {/* Main Floating Trigger Ball */}
          <button
            type="button"
            aria-label={isMobileOpen ? "Close social channels" : "Open social channels"}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_10px_25px_rgba(0,91,181,0.35)] border border-white/30 cursor-pointer active:scale-95 ${
              isMobileOpen
                ? "bg-[#0F172A] text-white rotate-90 shadow-gray-900/40"
                : "bg-gradient-to-br from-[#005bb5] via-[#0B4C87] to-[#003d7a] text-white hover:scale-105"
            }`}
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Send className="w-5 h-5 text-white -translate-x-[1px] translate-y-[1px]" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

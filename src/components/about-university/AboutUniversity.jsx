import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStrapiMediaUrl } from "../../lib/strapi";
import { ArrowRight, ArrowLeft, X, ZoomIn } from "lucide-react";

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

export default function AboutUniversity({ page }) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = Page 1, 1 = Page 2
  const [direction, setDirection] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const containerRef = useRef(null);

  // Smooth scroll to container top when page changes
  const scrollToTop = () => {
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentPage(1);
    scrollToTop();
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentPage(0);
    scrollToTop();
  };

  // Extract images dynamically from Strapi CMS sections.image-grid in exact API order
  const imageGridSection = page?.sections?.find(
    (s) => s.__component === "sections.image-grid"
  );
  const images = imageGridSection?.items || [];

  // Strictly preserve the exact API order (images[0], images[1], images[2], images[3], images[4])
  const img0 = images[0]; // 1. opening
  const img1 = images[1]; // 2. university
  const img2 = images[2]; // 3. university_name_Plate
  const img3 = images[3]; // 4. Shahu Maharaj
  const img4 = images[4]; // 5. Karmaveer Bhaurao Patil

  // Dynamic Title from Strapi CMS
  const displayTitle = page?.title?.trim() || "About Shivaji University";

  // Parse raw text paragraphs dynamically from Strapi CMS (page.content)
  const rawParagraphs = (page?.content || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Parse Paragraph 0 dynamically into components
  const parseP0 = (text) => {
    if (!text) return { p0Foundation: "", p0Shahu: "", p0Karmaveer: "" };
    const shahuMarker = "This region of Maharashtra";
    const karmaveerMarker = "This is also land of Karmaveer";
    
    const shahuIdx = text.indexOf(shahuMarker);
    const karmaveerIdx = text.indexOf(karmaveerMarker);
    
    if (shahuIdx !== -1 && karmaveerIdx !== -1) {
      return {
        p0Foundation: text.substring(0, shahuIdx).trim(),
        p0Shahu: text.substring(shahuIdx, karmaveerIdx).trim(),
        p0Karmaveer: text.substring(karmaveerIdx).trim(),
      };
    }
    return {
      p0Foundation: text,
      p0Shahu: "",
      p0Karmaveer: "",
    };
  };

  const { p0Foundation, p0Shahu, p0Karmaveer } = parseP0(rawParagraphs[0] || "");

  // Dynamic CMS Paragraphs
  const p1Faculties = rawParagraphs[1] || "";
  const p2Decades = rawParagraphs[2] || "";
  const p3Arts = rawParagraphs[3] || "";
  const p4Scholarships = rawParagraphs[4] || "";
  const p5MoUs = rawParagraphs[5] || "";
  const p6Admin = rawParagraphs[6] || "";
  const p7Future = rawParagraphs[7] || "";
  const p8Rankings = rawParagraphs[8] || "";
  const p9Summary = rawParagraphs[9] || "";
  const p10OfficeTitle = rawParagraphs[10] || "Office Working Hours";
  const p11OfficeHours = rawParagraphs[11] || "";
  const p12BankTitle = rawParagraphs[12] || "Post Office & Banking Hours";
  const p13BankHours = rawParagraphs[13] || "";

  // Reduced motion preference check
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

  // Handle modal backdrop escape key and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  // Clean Image Card rendering image directly from API item
  const renderImageCard = (imgObj) => {
    if (!imgObj) return null;
    const url = getStrapiMediaUrl(imgObj.image || imgObj.url || imgObj);
    const label = imgObj.label || imgObj.title || "Shivaji University";

    return (
      <div
        onClick={() => setSelectedImage({ ...imgObj, label })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedImage({ ...imgObj, label });
          }
        }}
        className="group relative flex flex-col rounded-xl overflow-hidden border border-gray-200/90 bg-white shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer w-full"
      >
        <div className="w-full bg-slate-50/80 p-2.5 flex items-center justify-center min-h-[175px] sm:min-h-[195px]">
          <img
            src={url}
            alt={label}
            draggable={false}
            className="w-full h-auto max-h-[185px] sm:max-h-[210px] object-contain mx-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.02] pointer-events-none"
          />
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full flex-1 flex flex-col">
      <div className="w-full flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {currentPage === 0 ? (
            /* ================= PAGE 1 (API IMAGES 0, 1, 2 IN EXACT ORDER) ================= */
            <motion.div
              key="page-1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              className="w-full flex-1 flex flex-col space-y-6"
            >
              {/* Top Navigation Bar */}
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Page 1 of 2
                </span>
                <button
                  type="button"
                  onClick={goToNext}
                  className="group inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#004a99] hover:bg-[#ff7f00] text-white font-medium text-xs sm:text-sm rounded shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Dynamic Page Title from CMS */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#005bb5] leading-tight">
                  {displayTitle}
                </h2>
                <span className="mt-2 block h-[2.5px] w-12 rounded-full bg-[#ff7f00]" />
              </div>

              {/* 1. API Image 0 (Right): opening */}
              {img0 && (
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 text-xs sm:text-[13.5px] text-[#333333] leading-relaxed text-justify sm:text-left space-y-2.5">
                    <p className="whitespace-pre-line leading-relaxed">
                      {p0Foundation}
                    </p>
                  </div>
                  <div className="w-full md:w-[270px] shrink-0">
                    {renderImageCard(img0)}
                  </div>
                </div>
              )}

              {/* 2. API Image 1 (Left): university */}
              {img1 && (
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="w-full md:w-[270px] shrink-0 order-2 md:order-1">
                    {renderImageCard(img1)}
                  </div>
                  <div className="flex-1 text-xs sm:text-[13.5px] text-[#333333] leading-relaxed text-justify sm:text-left space-y-2.5 order-1 md:order-2">
                    <p className="whitespace-pre-line leading-relaxed">
                      {p1Faculties}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. API Image 2 (Right): university_name_Plate */}
              {img2 && (
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 text-xs sm:text-[13.5px] text-[#333333] leading-relaxed text-justify sm:text-left space-y-2.5">
                    <p className="whitespace-pre-line leading-relaxed">
                      {p2Decades}
                    </p>
                  </div>
                  <div className="w-full md:w-[270px] shrink-0">
                    {renderImageCard(img2)}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* ================= PAGE 2 (API IMAGES 3, 4 IN EXACT ORDER + OPERATIONS) ================= */
            <motion.div
              key="page-2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              className="w-full flex-1 flex flex-col space-y-6"
            >
              {/* Top Navigation Bar */}
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPrev}
                  className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#005bb5] text-[#005bb5] hover:bg-[#005bb5] hover:text-white font-medium text-xs sm:text-sm rounded transition-colors duration-200 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Page 2 of 2
                </span>
              </div>

              {/* Dynamic Page Sub-Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#005bb5] leading-tight">
                  Visionary Heritage & Academic Excellence
                </h2>
                <span className="mt-2 block h-[2.5px] w-12 rounded-full bg-[#ff7f00]" />
              </div>

              {/* 4. API Image 3 (Right): Shahu Maharaj */}
              {img3 && (
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 text-xs sm:text-[13.5px] text-[#333333] leading-relaxed text-justify sm:text-left space-y-2.5">
                    {p0Shahu && (
                      <p className="whitespace-pre-line leading-relaxed">
                        {p0Shahu}
                      </p>
                    )}
                    {p3Arts && (
                      <p className="whitespace-pre-line leading-relaxed">
                        {p3Arts}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-[270px] shrink-0">
                    {renderImageCard(img3)}
                  </div>
                </div>
              )}

              {/* 5. API Image 4 (Left): Karmaveer Bhaurao Patil */}
              {img4 && (
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="w-full md:w-[270px] shrink-0 order-2 md:order-1">
                    {renderImageCard(img4)}
                  </div>
                  <div className="flex-1 text-xs sm:text-[13.5px] text-[#333333] leading-relaxed text-justify sm:text-left space-y-2.5 order-1 md:order-2">
                    {p0Karmaveer && (
                      <p className="whitespace-pre-line leading-relaxed">
                        {p0Karmaveer}
                      </p>
                    )}
                    {p4Scholarships && (
                      <p className="whitespace-pre-line leading-relaxed">
                        {p4Scholarships}
                      </p>
                    )}
                    {p5MoUs && (
                      <p className="whitespace-pre-line leading-relaxed">
                        {p5MoUs}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Administration, Rankings & Governance Full Width */}
              {(p6Admin || p7Future || p8Rankings) && (
                <div className="text-xs sm:text-[13.5px] text-[#333333] leading-relaxed text-justify sm:text-left space-y-2.5 pt-1">
                  {p6Admin && (
                    <p className="whitespace-pre-line leading-relaxed">
                      {p6Admin}
                    </p>
                  )}
                  {p7Future && (
                    <p className="whitespace-pre-line leading-relaxed">
                      {p7Future}
                    </p>
                  )}
                  {p8Rankings && (
                    <p className="whitespace-pre-line leading-relaxed">
                      {p8Rankings}
                    </p>
                  )}
                </div>
              )}

              {/* Concluding Summary */}
              {p9Summary && (
                <div className="text-xs sm:text-[13.5px] text-[#333333] leading-relaxed text-justify sm:text-left">
                  <p className="whitespace-pre-line leading-relaxed">
                    {p9Summary}
                  </p>
                </div>
              )}

              {/* Working Hours & Banking Services */}
              {(p11OfficeHours || p13BankHours) && (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  {p11OfficeHours && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold font-serif text-[#005bb5]">
                        {p10OfficeTitle}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-[13px] text-[#333333] leading-relaxed whitespace-pre-line">
                        {p11OfficeHours}
                      </p>
                    </div>
                  )}

                  {p13BankHours && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold font-serif text-[#005bb5]">
                        {p12BankTitle}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-[13px] text-[#333333] leading-relaxed whitespace-pre-line">
                        {p13BankHours}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal when clicking on any image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-black/95 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image preview"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-[#ff7f00] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image - Full Resolution Contained */}
            <div className="w-full max-h-[75vh] flex items-center justify-center bg-black/60 p-3 sm:p-6">
              <img
                src={getStrapiMediaUrl(selectedImage.image || selectedImage.url || selectedImage)}
                alt={selectedImage.label || "Shivaji University Preview"}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded"
              />
            </div>

            {/* Label Footer from CMS */}
            <div className="w-full p-3.5 bg-gray-900 border-t border-gray-800 text-center">
              <h4 className="text-white font-bold font-serif text-sm sm:text-base capitalize">
                {selectedImage.label || "Shivaji University Photograph"}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

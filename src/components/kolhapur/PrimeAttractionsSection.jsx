import React, { useRef, useState, useEffect } from "react";
import AttractionCard from "./AttractionCard";
import { getStrapiMediaUrl } from "../../lib/strapi";
import { X } from "lucide-react";

export default function PrimeAttractionsSection({
  data,
  loading = false,
}) {
  const scrollerRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Drag-to-scroll refs
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Extract items dynamically from Strapi data
  let items = [];
  let title = "Prime Attractions";

  if (data?.Prime_attractions && Array.isArray(data.Prime_attractions)) {
    const primary = data.Prime_attractions[0];
    if (primary) {
      title = primary.title || title;
      items = primary.items || [];
    }
  } else if (data?.items) {
    title = data.title || title;
    items = data.items;
  }

  // Split into 2 rows for the two-row scroller
  const row1 = items.filter((_, i) => i % 2 === 0);
  const row2 = items.filter((_, i) => i % 2 !== 0);

  // Repeat for continuous seamless infinite loop
  const displayRow1 = items.length > 2 ? [...row1, ...row1, ...row1] : row1;
  const displayRow2 = items.length > 2 ? [...row2, ...row2, ...row2] : row2;

  // Initialize scroll position to the middle set so user can scroll backward or forward immediately
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller && items.length > 2) {
      const oneSetWidth = scroller.scrollWidth / 3;
      if (scroller.scrollLeft < oneSetWidth) {
        scroller.scrollLeft = oneSetWidth;
      }
    }
  }, [items]);

  // Seamless boundary wrap function (works both forward and backward)
  const checkSeamlessWrap = () => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length <= 2) return;
    const oneSetWidth = scroller.scrollWidth / 3;
    if (oneSetWidth <= 0) return;

    if (scroller.scrollLeft >= oneSetWidth * 2) {
      scroller.scrollLeft -= oneSetWidth;
    } else if (scroller.scrollLeft <= 5) {
      scroller.scrollLeft += oneSetWidth;
    }
  };

  // Continuous auto-scroll loop that pauses on hover, drag, touch, or when modal is open
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length <= 2) return;

    let animationFrameId;
    let isHovered = false;
    let isTouching = false;
    const speed = 1.6; // Smooth, continuous auto-scroll speed

    const autoScroll = () => {
      if (
        !isHovered &&
        !isTouching &&
        !isMouseDownRef.current &&
        !selectedItem &&
        scroller
      ) {
        scroller.scrollLeft += speed;
        checkSeamlessWrap();
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
    };
    const handleTouchStart = () => {
      isTouching = true;
    };
    const handleTouchEnd = () => {
      isTouching = false;
    };

    scroller.addEventListener("mouseenter", handleMouseEnter);
    scroller.addEventListener("mouseleave", handleMouseLeave);
    scroller.addEventListener("touchstart", handleTouchStart, { passive: true });
    scroller.addEventListener("touchend", handleTouchEnd, { passive: true });
    scroller.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    scroller.addEventListener("scroll", checkSeamlessWrap);

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scroller.removeEventListener("mouseenter", handleMouseEnter);
      scroller.removeEventListener("mouseleave", handleMouseLeave);
      scroller.removeEventListener("touchstart", handleTouchStart);
      scroller.removeEventListener("touchend", handleTouchEnd);
      scroller.removeEventListener("touchcancel", handleTouchEnd);
      scroller.removeEventListener("scroll", checkSeamlessWrap);
    };
  }, [items, selectedItem]);

  // Mouse Drag-to-Scroll Handlers with window listeners for seamless dragging
  const handleMouseDown = (e) => {
    if (!scrollerRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollerRef.current.offsetLeft;
    scrollLeftRef.current = scrollerRef.current.scrollLeft;

    const onMouseMove = (moveEvent) => {
      if (!isMouseDownRef.current || !scrollerRef.current) return;
      const x = moveEvent.pageX - scrollerRef.current.offsetLeft;
      const walk = (x - startXRef.current) * 1.5; // Drag distance multiplier
      if (Math.abs(walk) > 4) {
        hasDraggedRef.current = true;
      }
      scrollerRef.current.scrollLeft = scrollLeftRef.current - walk;
      checkSeamlessWrap();
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Card click handler (avoids opening modal if user was dragging)
  const handleCardClick = (item) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    setSelectedItem(item);
  };

  // Handle modal backdrop escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  return (
    <section className="mt-9 pt-7 border-t border-gray-100">
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#005bb5] leading-tight">
          {title}
        </h2>
        <span className="mt-2 block h-[2.5px] w-12 rounded-full bg-[#ff7f00]" />
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="flex flex-col gap-3 overflow-x-auto scrollbar-hide py-1">
          <div className="flex gap-3 shrink-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={`sk1-${n}`}
                className="rounded-lg bg-gray-200 aspect-[16/10] w-44 sm:w-52 md:w-56 shrink-0 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="flex gap-3 shrink-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={`sk2-${n}`}
                className="rounded-lg bg-gray-200 aspect-[16/10] w-44 sm:w-52 md:w-56 shrink-0 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ) : items.length > 0 ? (
        /* Two-Row Gallery: Auto-scrolls, drag-to-scroll, and touch scrollable */
        <div
          ref={scrollerRef}
          onMouseDown={handleMouseDown}
          className="flex flex-col gap-3 overflow-x-auto scrollbar-hide py-1 select-none cursor-grab active:cursor-grabbing"
        >
          {/* Row 1 */}
          <div className="flex gap-3 shrink-0">
            {displayRow1.map((item, idx) => (
              <AttractionCard
                key={`r1-${idx}`}
                item={item}
                onClick={handleCardClick}
              />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-3 shrink-0">
            {displayRow2.map((item, idx) => (
              <AttractionCard
                key={`r2-${idx}`}
                item={item}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic text-xs sm:text-sm">
          No prime attractions available at the moment.
        </p>
      )}

      {/* Lightbox Modal when clicking on any image */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-black/90 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="Close image preview"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-[#ff7f00] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image */}
            <div className="w-full max-h-[75vh] flex items-center justify-center bg-black/60 p-2 sm:p-4">
              <img
                src={getStrapiMediaUrl(selectedItem.image)}
                alt={selectedItem.label}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded"
              />
            </div>

            {/* Label Footer */}
            <div className="w-full p-3 sm:p-3.5 bg-gray-900 border-t border-gray-800 text-center">
              <h4 className="text-white font-bold font-serif text-sm sm:text-base">
                {selectedItem.label}
              </h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

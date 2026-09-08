import React, { useState, useRef } from "react";
import AboutSection from "./AboutSection";
import HowToReachSection from "./HowToReachSection";
import KolhapurCTA from "./KolhapurCTA";
import TouristInterestSection from "./TouristInterestSection";
import PrimeAttractionsSection from "./PrimeAttractionsSection";
import KolhapurContentSlider from "./KolhapurContentSlider";
import { ArrowLeft } from "lucide-react";

export default function AboutKolhapur({ page }) {
  const [activeView, setActiveView] = useState("overview"); // "overview" | "attractions"
  const [direction, setDirection] = useState(1);
  const containerRef = useRef(null);

  // Smooth scroll to container top when view changes
  const scrollToTop = () => {
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  };

  const goToAttractions = () => {
    setDirection(1);
    setActiveView("attractions");
    scrollToTop();
  };

  const goToOverview = () => {
    setDirection(-1);
    setActiveView("overview");
    scrollToTop();
  };

  // Extract sections from page dynamically from Strapi
  const reachingSection = page?.sections?.find(
    (s) => s.__component === "sections.reaching-kolhapur-city"
  );

  const touristAttractionsSection = page?.sections?.find(
    (s) => s.__component === "sections.tourist-interest-prime-attractions"
  );

  // Fallback image-grid section if present separately
  const imageGridSection = page?.sections?.find(
    (s) => s.__component === "sections.image-grid"
  );

  return (
    <div ref={containerRef} className="w-full flex-1 flex flex-col">
      {/* Two-Step Animated Content Slider */}
      <KolhapurContentSlider
        activeView={activeView}
        direction={direction}
        overviewContent={
          <div className="flex-1 flex flex-col">
            {/* Top Next Button */}
            <KolhapurCTA onNext={goToAttractions} />

            {/* 1. About Kolhapur Section */}
            <AboutSection title={page?.title} content={page?.content} />

            {/* 2. How to Reach Kolhapur Section */}
            <HowToReachSection data={reachingSection} />
          </div>
        }
        attractionsContent={
          <div className="flex-1 flex flex-col">
            {/* Top Back Button */}
            <div className="pb-3 mb-5 border-b border-gray-100 flex justify-start">
              <button
                type="button"
                onClick={goToOverview}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#005bb5] text-[#005bb5] hover:bg-[#005bb5] hover:text-white font-medium text-xs sm:text-sm rounded transition-colors duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
            </div>

            {/* 3. Places of Tourist Interest Section */}
            <TouristInterestSection data={touristAttractionsSection} />

            {/* 4. Prime Attractions Section */}
            <PrimeAttractionsSection
              data={touristAttractionsSection || imageGridSection}
            />
          </div>
        }
      />
    </div>
  );
}

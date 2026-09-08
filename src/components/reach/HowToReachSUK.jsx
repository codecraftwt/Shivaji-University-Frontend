import React from "react";
import TransportCard from "../kolhapur/TransportCard";

export default function HowToReachSUK({ page }) {
  // Extract reaching section dynamically from Strapi
  const reachingSection = page?.sections?.find(
    (s) => s.__component === "sections.reaching-kolhapur-city"
  );

  const sectionTitle = reachingSection?.title?.trim() || "How to Reach Kolhapur";
  const transportItems = reachingSection?.reaching_type || [];

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#005bb5] leading-tight">
          {sectionTitle}
        </h2>
        <span className="mt-2 block h-[2.5px] w-12 rounded-full bg-[#ff7f00]" />
      </div>

      {/* Transportation Cards */}
      {transportItems.length > 0 ? (
        <div className="flex flex-col gap-3 sm:gap-3.5">
          {transportItems.map((item, idx) => (
            <TransportCard key={item.id || idx} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-5 text-center text-xs sm:text-sm text-gray-500 border border-gray-200">
          No transportation information available at the moment.
        </div>
      )}
    </div>
  );
}

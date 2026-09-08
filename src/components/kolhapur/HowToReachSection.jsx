import React from "react";
import TransportCard from "./TransportCard";

export default function HowToReachSection({ data, loading = false }) {
  const sectionTitle = data?.title?.trim() || "How to Reach Kolhapur";
  const transportItems = data?.reaching_type || [];

  return (
    <section className="mt-9 pt-7 border-t border-gray-100">
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#005bb5] leading-tight">
          {sectionTitle}
        </h2>
        <span className="mt-2 block h-[2.5px] w-12 rounded-full bg-[#ff7f00]" />
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="flex flex-col gap-3.5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-lg p-3.5 sm:p-4 border border-gray-200 shadow-xs animate-pulse flex items-start gap-3.5 sm:gap-5"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-200 rounded-lg shrink-0"></div>
              <div className="hidden sm:block w-[1px] self-stretch bg-gray-200 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="w-28 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-3 bg-gray-100 rounded"></div>
                <div className="w-4/5 h-3 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : transportItems.length > 0 ? (
        /* Horizontal cards stacked one below one */
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
    </section>
  );
}

import React from "react";

/**
 * Parses raw tourist interest text from Strapi into structured landmark headings and paragraphs
 */
function parseTouristInterests(rawText) {
  if (!rawText) return [];

  // Split into paragraphs
  const paragraphs = rawText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const items = [];
  let currentItem = null;

  // Known landmark titles from Strapi content
  const landmarkKeywords = [
    "Maharaja's Palace",
    "Panhala Hill Station",
    "Panhala Fort",
    "Bhavani Mandap",
    "Rankala Lake",
    "Mahalaxmi Temple",
    "Town Hall",
    "New Palace",
    "Shalini Palace",
  ];

  for (const para of paragraphs) {
    const matched = landmarkKeywords.find((name) => para.startsWith(name));
    if (matched) {
      if (currentItem) items.push(currentItem);
      const remainingText = para.slice(matched.length).trim();
      currentItem = {
        title: matched,
        paragraphs: remainingText ? [remainingText] : [],
      };
    } else {
      if (currentItem) {
        currentItem.paragraphs.push(para);
      } else {
        currentItem = {
          title: "",
          paragraphs: [para],
        };
      }
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
}

export default function TouristInterestSection({ data, loading = false }) {
  const sectionTitle = data?.main_title?.trim() || "Places of Tourist Interest";
  const rawDescription = data?.Discription || data?.discription || data?.description || "";
  const items = parseTouristInterests(rawDescription);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#005bb5] leading-tight">
          {sectionTitle}
        </h2>
        <span className="mt-2 block h-[2.5px] w-12 rounded-full bg-[#ff7f00]" />
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-5 animate-pulse">
          <div>
            <div className="w-40 h-5 bg-gray-200 rounded mb-2.5"></div>
            <div className="space-y-2">
              <div className="w-full h-3.5 bg-gray-100 rounded"></div>
              <div className="w-5/6 h-3.5 bg-gray-100 rounded"></div>
              <div className="w-4/6 h-3.5 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div>
            <div className="w-36 h-5 bg-gray-200 rounded mb-2.5"></div>
            <div className="space-y-2">
              <div className="w-full h-3.5 bg-gray-100 rounded"></div>
              <div className="w-3/4 h-3.5 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      ) : items.length > 0 ? (
        /* Formal paragraph/content documentation style */
        <div className="space-y-4 sm:space-y-5 max-w-none text-[#333333] text-xs sm:text-sm">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {item.title && (
                <h3 className="text-base sm:text-lg font-bold font-serif text-[#005bb5]">
                  {item.title}
                </h3>
              )}
              <div className="space-y-2.5">
                {item.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="leading-relaxed whitespace-pre-line text-[#333333]">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-xs sm:text-sm">
          No information available at the moment.
        </p>
      )}
    </section>
  );
}

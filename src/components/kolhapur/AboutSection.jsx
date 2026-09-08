import React from "react";

export default function AboutSection({ title, content }) {
  const displayTitle = title?.trim() || "About Kolhapur City";

  // Check if content contains HTML tags
  const isHtml = /<[a-z][\s\S]*>/i.test(content || "");

  // Dynamically break raw text by paragraph breaks
  const paragraphs = (content || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#005bb5] leading-tight">
          {displayTitle}
        </h2>
        <span className="mt-2 block h-[2.5px] w-12 rounded-full bg-[#ff7f00]" />
      </div>

      {/* Formal Academic Content */}
      <div className="prose max-w-none text-xs sm:text-sm text-[#333333] leading-relaxed">
        {isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : paragraphs.length > 0 ? (
          <div className="space-y-3.5">
            {paragraphs.map((para, index) => (
              <p key={index} className="leading-relaxed whitespace-pre-line text-[#333333]">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-xs sm:text-sm">
            No information available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}

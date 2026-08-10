import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CalendarDays, Trophy, ArrowRight, ArrowUpRight } from "lucide-react";
import { getStrapiMediaUrl } from "../../lib/strapi";
import "./PremiumNoticeBoard.css";

/**
 * PremiumNoticeBoard
 * A three-column "Updates / Upcoming Events / Achievements" panel.
 * - Each column auto-scrolls vertically like a slow news reel, pausing on hover.
 * - One column scrolls up, the next scrolls down, alternating for a dynamic feel.
 * - Hovering a column cross-fades its photo (one image per column) behind it.
 * - Brand: navy (#0B4C87) + signal orange (#FF7B12) on a light surface.
 */

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function Column({ column, idx }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = column.icon;
  const loopItems = [...column.items, ...column.items];
  const activeImage = isHovered ? column.image : null;
  const scrollClass = idx % 2 === 0 ? "scroll-up" : "scroll-down";

  return (
    <div
      className="group relative flex-1 min-w-[260px] overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]"
      style={{
        background: "linear-gradient(165deg, #ffffff 0%, #f6f7fb 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* hover-revealed column photo */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key={activeImage}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={activeImage} alt="" className="h-full w-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* light scrim over the photo */}
      {activeImage && (
        <div
          className="absolute inset-0 z-[1] transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.94) 100%)",
          }}
        />
      )}

      {/* content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(140deg, #0B4C87, #123a63)",
              boxShadow: "0 4px 12px -2px rgba(11,76,135,0.4)",
            }}
          >
            <Icon size={16} strokeWidth={2} className="text-white" />
            {column.live && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF7B12] opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF7B12] ring-2 ring-white" />
              </span>
            )}
          </div>
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#0B2540]">
              {column.label}
            </h3>
            <div className="mt-1.5 h-px w-10 bg-gradient-to-r from-[#FF7B12] to-transparent" />
          </div>
        </div>

        {/* scrolling list */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            maskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="scroll-container">
            <div className={`scroll-list ${scrollClass}`}>
              {loopItems.map((item, i) => {
                const title = item.title ?? item.text;
                const tag = formatDate(item.date) ?? item.tag;
                return (
                  <a
                    key={i}
                    href={item.link}
                    className="group/item flex items-start gap-3 px-6 py-3.5 transition-colors duration-200 hover:bg-black/[0.03]"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#FF7B12]/60 transition-all duration-200 group-hover/item:w-2.5 group-hover/item:bg-[#FF7B12]" />
                    <div className="min-w-0 flex-1">
                      {tag && (
                        <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-wider text-[#c95f0d]">
                          {tag}
                        </span>
                      )}
                      <p className="text-[13.5px] font-medium leading-snug text-[#3a4a63] transition-colors duration-200 group-hover/item:text-[#0B2540]">
                        {title}
                      </p>
                    </div>
                    <ArrowUpRight size={14} className="mt-1 shrink-0 -translate-x-1 text-[#FF7B12] opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-6 pb-6 pt-4">
          <button className="group/btn flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF7B12] to-[#e8660a] px-5 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-white shadow-[0_8px_20px_-6px_rgba(255,123,18,0.55)] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_10px_26px_-6px_rgba(255,123,18,0.7)]">
            View More
            <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PremiumNoticeBoard({ data }) {
  if (!data?.updates?.length && !data?.events?.length && !data?.achievements?.length) {
    return null;
  }

  const columns = [
    {
      key: "updates",
      label: "Updates",
      icon: Bell,
      live: true,
      image: getStrapiMediaUrl(data.updatesImage) || "",
      items: data.updates || [],
    },
    {
      key: "events",
      label: "Upcoming Events",
      icon: CalendarDays,
      image: getStrapiMediaUrl(data.eventsImage) || "",
      items: data.events || [],
    },
    {
      key: "achievements",
      label: "Achievements",
      icon: Trophy,
      image: getStrapiMediaUrl(data.achievementsImage) || "",
      items: data.achievements || [],
    },
  ];

  return (
    <section
      className="relative w-full px-4 py-10"
      style={{ background: "radial-gradient(120% 100% at 50% 0%, #eef2f8 0%, #dfe6f0 70%)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row">
        {columns.map((col, idx) => (
          <Column key={col.key} column={col} idx={idx} />
        ))}
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { resolveHref } from "../lib/strapi";
import { X, Menu, ChevronRight, ChevronDown } from "lucide-react";

export default function SidebarMenu({ menuData }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [openNestedMap, setOpenNestedMap] = useState({});

  const toggleNested = (key) => {
    setOpenNestedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Auto-expand dropdown if active link is inside a nested item
  useEffect(() => {
    if (!menuData?.dropdown_items) return;
    const newOpen = {};
    menuData.dropdown_items.forEach((item, itemIdx) => {
      item.sub_items?.forEach((sub, subIdx) => {
        const key = `${item.id || itemIdx}-${sub.id || subIdx}`;
        const isCurrentSub = currentPath === resolveHref(sub);
        const isNestedActive = sub.nested_nav_items?.some(
          (nested) => currentPath === resolveHref(nested)
        );
        if (isCurrentSub || isNestedActive) {
          newOpen[key] = true;
        }
      });
    });
    setOpenNestedMap((prev) => ({ ...prev, ...newOpen }));
  }, [currentPath, menuData]);

  // Track scroll position to adjust floating button height (moves up only when ^ ScrollToTop button is visible)
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile top-to-bottom drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!menuData || !menuData.dropdown_items) return null;

  const renderNavList = (onItemClick = () => {}) => (
    <nav className="flex flex-col gap-1.5">
      {menuData.dropdown_items.map((item, idx) => {
        const itemHref = resolveHref(item);
        const hasSubItems = item.sub_items && item.sub_items.length > 0;
        const isItemActive = currentPath === itemHref;
        const itemLabel = item.label || item.lable;

        return (
          <div key={item.id || idx} className="flex flex-col gap-1">
            {hasSubItems ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 bg-slate-50/80 rounded-lg">
                  <span>{itemLabel}</span>
                </div>
                <div className="pl-2 flex flex-col gap-1 border-l-2 border-slate-100 ml-2 my-1">
                  {item.sub_items.map((sub, subIdx) => {
                    const subHref = resolveHref(sub);
                    const isSubActive = currentPath === subHref;
                    const isExternal = subHref.startsWith("http");
                    const subLabel = sub.label || sub.lable;
                    const nestedItems = sub.nested_nav_items || [];
                    const hasNested = nestedItems.length > 0;
                    const nestedKey = `${item.id || idx}-${sub.id || subIdx}`;
                    const isNestedOpen = !!openNestedMap[nestedKey];
                    const isAnyChildActive = nestedItems.some(
                      (nested) => currentPath === resolveHref(nested)
                    );

                    return (
                      <div key={sub.id || subIdx} className="flex flex-col">
                        {hasNested ? (
                          /* Sub-Item Header with Dropdown Toggle */
                          <div className="flex items-center justify-between w-full rounded-lg transition-colors group/sub">
                            {isExternal ? (
                              <a
                                href={subHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={onItemClick}
                                className="flex-1 flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:bg-slate-50 hover:text-[#005bb5] rounded-l-lg truncate"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                                <span className="truncate">{subLabel}</span>
                              </a>
                            ) : subHref && subHref !== "#" && subHref !== "/" ? (
                              <Link
                                to={subHref}
                                onClick={onItemClick}
                                className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium transition-all rounded-l-lg truncate ${
                                  isSubActive
                                    ? "bg-[#005bb5] text-white shadow-xs font-semibold"
                                    : isAnyChildActive
                                    ? "text-[#005bb5] font-semibold bg-slate-50"
                                    : "text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isSubActive
                                      ? "bg-[#ff7f00]"
                                      : isAnyChildActive
                                      ? "bg-[#005bb5]"
                                      : "bg-gray-300"
                                  }`}
                                />
                                <span className="truncate">{subLabel}</span>
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggleNested(nestedKey)}
                                className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium transition-all text-left rounded-l-lg cursor-pointer ${
                                  isAnyChildActive
                                    ? "text-[#005bb5] font-semibold bg-slate-50"
                                    : "text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isAnyChildActive ? "bg-[#005bb5]" : "bg-gray-300"
                                  }`}
                                />
                                <span className="truncate">{subLabel}</span>
                              </button>
                            )}

                            {/* Dropdown Toggle Chevron Button */}
                            <button
                              type="button"
                              aria-label={isNestedOpen ? "Collapse sub-menu" : "Expand sub-menu"}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNested(nestedKey);
                              }}
                              className={`p-2 rounded-r-lg transition-colors cursor-pointer flex items-center justify-center hover:bg-slate-100 ${
                                isSubActive
                                  ? "bg-[#005bb5] text-white hover:bg-[#004c99]"
                                  : "text-gray-400 hover:text-[#005bb5]"
                              }`}
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isNestedOpen ? "rotate-180 text-[#ff7f00]" : ""
                                }`}
                              />
                            </button>
                          </div>
                        ) : isExternal ? (
                          <a
                            href={subHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onItemClick}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                            <span className="truncate">{subLabel}</span>
                          </a>
                        ) : (
                          <Link
                            to={subHref}
                            onClick={onItemClick}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                              isSubActive
                                ? "bg-[#005bb5] text-white shadow-xs font-semibold translate-x-0.5"
                                : "text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSubActive ? "bg-[#ff7f00]" : "bg-gray-300"
                              }`}
                            />
                            <span className="truncate">{subLabel}</span>
                          </Link>
                        )}

                        {/* 3rd-level Nested Navigation Items (Dropdown Accordion) */}
                        {hasNested && (
                          <div
                            className={`grid transition-all duration-200 ease-out overflow-hidden ${
                              isNestedOpen
                                ? "grid-rows-[1fr] opacity-100 mt-1 mb-1.5"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="min-h-0 pl-3.5 ml-2.5 border-l-2 border-[#005bb5]/20 flex flex-col gap-1 bg-slate-50/50 py-1.5 px-1 rounded-r-lg">
                              {nestedItems.map((nested, nIdx) => {
                                const nestedHref = resolveHref(nested);
                                const isNestedActive = currentPath === nestedHref;
                                const isNestedExternal = nestedHref.startsWith("http");
                                const nestedLabel = nested.label || nested.lable;

                                return isNestedExternal ? (
                                  <a
                                    key={nested.id || nIdx}
                                    href={nestedHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onItemClick}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all text-gray-600 hover:text-[#005bb5] hover:bg-white shadow-xs"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                                    <span className="truncate">{nestedLabel}</span>
                                  </a>
                                ) : (
                                  <Link
                                    key={nested.id || nIdx}
                                    to={nestedHref}
                                    onClick={onItemClick}
                                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                                      isNestedActive
                                        ? "bg-[#005bb5] text-white font-semibold shadow-xs"
                                        : "text-gray-600 hover:text-[#005bb5] hover:bg-white"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        isNestedActive ? "bg-[#ff7f00]" : "bg-gray-300"
                                      }`}
                                    />
                                    <span className="truncate">{nestedLabel}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : itemHref.startsWith("http") ? (
              <a
                href={itemHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onItemClick}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
              >
                <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{itemLabel}</span>
              </a>
            ) : (
              <Link
                to={itemHref}
                onClick={onItemClick}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isItemActive
                    ? "bg-[#005bb5] text-white shadow-xs font-semibold translate-x-0.5"
                    : "text-gray-600 hover:bg-slate-50 hover:text-[#005bb5]"
                }`}
              >
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isItemActive ? "text-[#ff7f00]" : "text-gray-400"
                  }`}
                />
                <span className="truncate">{itemLabel}</span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ─── 1. Desktop Static Sidebar (Visible on md and above) ─── */}
      <aside className="hidden md:flex w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 self-stretch flex-col shrink-0">
        <h3 className="text-lg sm:text-xl font-bold font-serif text-[#005bb5] mb-5 border-b-2 border-[#ff7f00] pb-2 inline-block">
          {menuData.label || "Quick Navigation"}
        </h3>
        {renderNavList()}
      </aside>

      {/* ─── 2. Mobile Floating Sidebar Button (Fixed at Bottom-Right, moves down when alone, up when ^ is present) ─── */}
      <button
        type="button"
        aria-label="Open sidebar navigation"
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed right-6 z-[9990] w-12 h-12 rounded-full bg-gradient-to-br from-[#005bb5] via-[#0B4C87] to-[#003d7a] text-white shadow-[0_10px_25px_rgba(0,91,181,0.35)] flex items-center justify-center border border-white/25 active:scale-90 hover:scale-105 transition-all duration-300 ease-out cursor-pointer backdrop-blur-md ${
          hasScrolled ? "bottom-20" : "bottom-6"
        }`}
        title="Open Navigation"
      >
        {/* Sidebar 3-Line Menu Icon */}
        <Menu className="w-5 h-5 text-white relative z-10" />
      </button>

      {/* ─── 3. Mobile Top-to-Bottom Slide-Down Window Slider ─── */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-[9995] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-Down Window Panel (From Top to Bottom) */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 max-h-[85vh] bg-white rounded-b-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        {/* Header with Title & Close Button */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-base font-bold font-serif text-[#005bb5]">
              {menuData.label || "Quick Navigation"}
            </h3>
            <span className="block h-[2px] w-8 rounded-full bg-[#ff7f00] mt-0.5" />
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {renderNavList(() => setIsOpen(false))}
        </div>

        {/* Bottom Swipe-up Hint Bar */}
        <div
          onClick={() => setIsOpen(false)}
          className="py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
      </div>
    </>
  );
}

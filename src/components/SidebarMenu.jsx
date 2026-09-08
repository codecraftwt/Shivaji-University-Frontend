import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { resolveHref } from "../lib/strapi";
import { X, Menu, ChevronRight, Move } from "lucide-react";

export default function SidebarMenu({ menuData }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);

  // Floating Ball position & drag state (mobile only)
  const [ballPos, setBallPos] = useState({ x: null, y: null });
  const [isDragUnlocked, setIsDragUnlocked] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  
  const longPressTimerRef = useRef(null);
  const isDragUnlockedRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0, ballX: 0, ballY: 0, startTime: 0 });
  const hasMovedFarRef = useRef(false);
  const justDraggedRef = useRef(false);
  const ballRef = useRef(null);

  // Synchronize ref with state
  useEffect(() => {
    isDragUnlockedRef.current = isDragUnlocked;
  }, [isDragUnlocked]);

  // Initialize ball position near bottom-right on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDefaultPos = () => {
        const initialX = window.innerWidth - 64;
        const initialY = window.innerHeight - 120;
        setBallPos((prev) => ({
          x: prev.x !== null ? Math.min(Math.max(12, prev.x), window.innerWidth - 60) : Math.max(16, initialX),
          y: prev.y !== null ? Math.min(Math.max(60, prev.y), window.innerHeight - 80) : Math.max(80, initialY),
        }));
      };
      updateDefaultPos();
      window.addEventListener("resize", updateDefaultPos);
      return () => window.removeEventListener("resize", updateDefaultPos);
    }
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

  // ─── Touch Handlers: 2-3s Long-Press to Move, Quick Tap to Open ───
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    hasMovedFarRef.current = false;
    isDragUnlockedRef.current = false;
    setIsDragUnlocked(false);
    setIsHolding(true);

    dragStartPosRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      ballX: ballPos.x ?? (window.innerWidth - 64),
      ballY: ballPos.y ?? (window.innerHeight - 120),
      startTime: Date.now(),
    };

    // Require 1.8s long-press to unlock movable mode
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      isDragUnlockedRef.current = true;
      setIsDragUnlocked(true);
      setIsHolding(false);
      // Haptic vibration feedback if supported
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try { navigator.vibrate(60); } catch (_) {}
      }
    }, 1800);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartPosRef.current.x;
    const dy = touch.clientY - dragStartPosRef.current.y;
    const distance = Math.hypot(dx, dy);

    // If moved before holding for 2 seconds, cancel long-press
    if (!isDragUnlockedRef.current) {
      if (distance > 12) {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        setIsHolding(false);
      }
      return;
    }

    // Move is unlocked: drag the ball smoothly across screen
    hasMovedFarRef.current = true;
    justDraggedRef.current = true;
    const maxX = window.innerWidth - 56;
    const maxY = window.innerHeight - 60;
    const newX = Math.min(Math.max(12, dragStartPosRef.current.ballX + dx), maxX);
    const newY = Math.min(Math.max(60, dragStartPosRef.current.ballY + dy), maxY);
    setBallPos({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    setIsHolding(false);

    const wasUnlocked = isDragUnlockedRef.current;
    const moved = hasMovedFarRef.current;

    setIsDragUnlocked(false);
    isDragUnlockedRef.current = false;

    // If not in drag mode, it's a regular tap -> instantly open sidebar
    if (!wasUnlocked) {
      setIsOpen(true);
    } else if (moved) {
      // It was dragged to a new place
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 200);
    }
  };

  // ─── Mouse Handlers for Desktop Testing ───
  const handleMouseDown = (e) => {
    hasMovedFarRef.current = false;
    isDragUnlockedRef.current = false;
    setIsDragUnlocked(false);
    setIsHolding(true);

    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      ballX: ballPos.x ?? (window.innerWidth - 64),
      ballY: ballPos.y ?? (window.innerHeight - 120),
      startTime: Date.now(),
    };

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      isDragUnlockedRef.current = true;
      setIsDragUnlocked(true);
      setIsHolding(false);
    }, 1800);

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartPosRef.current.x;
      const dy = moveEvent.clientY - dragStartPosRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (!isDragUnlockedRef.current) {
        if (distance > 10) {
          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          setIsHolding(false);
        }
        return;
      }

      hasMovedFarRef.current = true;
      justDraggedRef.current = true;
      const maxX = window.innerWidth - 56;
      const maxY = window.innerHeight - 60;
      const newX = Math.min(Math.max(12, dragStartPosRef.current.ballX + dx), maxX);
      const newY = Math.min(Math.max(60, dragStartPosRef.current.ballY + dy), maxY);
      setBallPos({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      setIsHolding(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      const wasUnlocked = isDragUnlockedRef.current;
      setIsDragUnlocked(false);
      isDragUnlockedRef.current = false;

      if (!wasUnlocked) {
        setIsOpen(true);
      } else {
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 200);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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

                    return (
                      <div key={sub.id || subIdx} className="flex flex-col gap-1">
                        {isExternal ? (
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

                        {/* 3rd-level Nested Navigation Items */}
                        {hasNested && (
                          <div className="pl-3.5 ml-2.5 border-l border-slate-200 flex flex-col gap-1 my-0.5">
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
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11.5px] sm:text-xs font-medium transition-all text-gray-500 hover:text-[#005bb5] hover:bg-slate-50"
                                >
                                  <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                  <span className="truncate">{nestedLabel}</span>
                                </a>
                              ) : (
                                <Link
                                  key={nested.id || nIdx}
                                  to={nestedHref}
                                  onClick={onItemClick}
                                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11.5px] sm:text-xs font-medium transition-all ${
                                    isNestedActive
                                      ? "bg-slate-100 text-[#005bb5] font-semibold"
                                      : "text-gray-500 hover:text-[#005bb5] hover:bg-slate-50"
                                  }`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full shrink-0 ${
                                      isNestedActive ? "bg-[#ff7f00]" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="truncate">{nestedLabel}</span>
                                </Link>
                              );
                            })}
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

      {/* ─── 2. Mobile Floating Movable 3-Line Ball Button (Visible on mobile only) ─── */}
      <div
        ref={ballRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          touchAction: "none",
          left: ballPos.x !== null ? `${ballPos.x}px` : undefined,
          right: ballPos.x === null ? "16px" : undefined,
          top: ballPos.y !== null ? `${ballPos.y}px` : undefined,
          bottom: ballPos.y === null ? "100px" : undefined,
        }}
        className="md:hidden fixed z-[3000] select-none"
        title={isDragUnlocked ? "Drag to move around screen" : "Tap to open navigation, hold 2s to move"}
      >
        <button
          type="button"
          aria-label={isDragUnlocked ? "Move navigation ball" : "Open sidebar menu"}
          onClick={(e) => {
            e.stopPropagation();
            if (!justDraggedRef.current && !isDragUnlocked) {
              setIsOpen(true);
            }
          }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
            isDragUnlocked
              ? "bg-gradient-to-br from-[#ff7f00] to-[#d96500] text-white scale-110 ring-4 ring-[#ff7f00]/50 shadow-[#ff7f00]/60 cursor-move"
              : isHolding
              ? "bg-gradient-to-br from-[#005bb5] to-[#ff7f00] text-white scale-105 ring-2 ring-[#ff7f00]/40 shadow-[#005bb5]/50"
              : "bg-gradient-to-br from-[#005bb5] to-[#003d7a] text-white border-2 border-[#ff7f00] shadow-[#005bb5]/50 active:scale-95"
          }`}
        >
          {/* Animated Glow Ping in normal mode */}
          {!isDragUnlocked && (
            <span className="absolute -inset-1 rounded-full bg-[#ff7f00]/35 animate-ping pointer-events-none opacity-70" />
          )}

          {/* Long press charge ring when holding */}
          {isHolding && !isDragUnlocked && (
            <span className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#ff7f00] animate-spin pointer-events-none" />
          )}

          {/* Icon switches to Move arrows when drag mode is active, otherwise 3-line hamburger */}
          {isDragUnlocked ? (
            <Move className="w-6 h-6 text-white animate-pulse relative z-10" />
          ) : (
            <Menu className="w-6 h-6 text-white relative z-10" />
          )}

          {/* Tooltip badge when drag mode is unlocked */}
          {isDragUnlocked && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#0F172A] text-[10px] font-bold text-[#ff7f00] uppercase tracking-wider whitespace-nowrap shadow-md pointer-events-none">
              Move
            </span>
          )}
        </button>
      </div>

      {/* ─── 3. Mobile Top-to-Bottom Slide-Down Window Slider ─── */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-[3100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-Down Window Panel (From Top to Bottom) */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 max-h-[85vh] bg-white rounded-b-2xl shadow-2xl z-[3200] flex flex-col overflow-hidden transition-transform duration-300 ease-out transform ${
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

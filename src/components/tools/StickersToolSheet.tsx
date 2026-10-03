"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { AVAILABLE_STICKERS, StickerOption } from "@/types/magazine";
import { useMagazineStore } from "@/store/useMagazineStore";
import { Sparkles, X, Upload, Check } from "lucide-react";

const CATEGORIES = [
  "All",
  "Florals & Nature",
  "Love & Romance",
  "Seals & Stamps",
  "Stars & Sparkles",
  "Cute Scrapbook",
  "Craft & Clips",
];

export const StickersToolSheet: React.FC = () => {
  const {
    activeToolModal,
    setActiveToolModal,
    currentPage,
    addPlacedSticker,
  } = useMagazineStore();

  const [stickersList, setStickersList] = useState<StickerOption[]>(AVAILABLE_STICKERS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [placedFeedback, setPlacedFeedback] = useState<string | null>(null);
  const customStickerInputRef = useRef<HTMLInputElement>(null);

  // Dynamically sync from src/stickers via /api/stickers
  React.useEffect(() => {
    fetch("/api/stickers")
      .then((res) => res.json())
      .then((data) => {
        if (data.stickers && Array.isArray(data.stickers) && data.stickers.length > 0) {
          const apiSrcs = new Set(data.stickers.map((s: StickerOption) => s.src));
          const fallbackNonApi = AVAILABLE_STICKERS.filter((s) => !apiSrcs.has(s.src));
          setStickersList([...data.stickers, ...fallbackNonApi]);
        }
      })
      .catch((err) => console.log("Using static sticker catalog", err));
  }, []);

  // Determine selectable pages based on current open spread
  // Spread 1: Pages 1 & 2. Spread 2: Pages 3 & 4. Closed: Page 0 or Page 5.
  const isCover = currentPage === 0;
  const isBack = currentPage >= 5;
  const spreadPages = isCover
    ? [0]
    : isBack
    ? [5]
    : currentPage <= 2
    ? [1, 2]
    : [3, 4];

  const [targetPage, setTargetPage] = useState<number>(() => {
    return spreadPages.includes(currentPage) ? currentPage : spreadPages[0];
  });

  // Keep targetPage in sync if user flips page
  React.useEffect(() => {
    if (!spreadPages.includes(targetPage)) {
      setTargetPage(spreadPages[0]);
    }
  }, [currentPage, spreadPages, targetPage]);

  if (activeToolModal !== "stickers") return null;

  const filteredStickers =
    selectedCategory === "All"
      ? stickersList
      : stickersList.filter((s) => s.category === selectedCategory);

  const handlePlaceSticker = (sticker: StickerOption) => {
    addPlacedSticker({
      pageIndex: targetPage,
      src: sticker.src,
      name: sticker.name,
      x: 50 + (Math.random() * 18 - 9),
      y: 50 + (Math.random() * 18 - 9),
      rotation: Math.round(Math.random() * 20 - 10),
      scale: 1,
    });

    const pageLabel =
      targetPage === 0
        ? "Front Cover"
        : targetPage === 5
        ? "Back Cover"
        : `Page ${targetPage}`;

    setPlacedFeedback(`Placed "${sticker.name}" on ${pageLabel}!`);
    setTimeout(() => setPlacedFeedback(null), 2400);

    // Hide the sticker adding panel automatically
    setActiveToolModal(null);
  };

  const handleCustomStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const customSrc = event.target.result as string;
          addPlacedSticker({
            pageIndex: targetPage,
            src: customSrc,
            name: file.name.replace(/\.[^/.]+$/, ""),
            x: 50,
            y: 50,
            rotation: 0,
            scale: 1,
          });
          const pageLabel =
            targetPage === 0
              ? "Front Cover"
              : targetPage === 5
              ? "Back Cover"
              : `Page ${targetPage}`;
          setPlacedFeedback(`Custom sticker added to ${pageLabel}!`);
          setTimeout(() => setPlacedFeedback(null), 2400);

          // Hide the sticker adding panel automatically
          setActiveToolModal(null);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = "";
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col justify-end bg-black/35 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-[#fdfbf7] border-t-2 border-[#d4af37]/60 shadow-[0_-12px_40px_rgba(0,0,0,0.2)] max-w-4xl w-full mx-auto rounded-t-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#ebdccb] bg-[#f8f1e5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9e2a2b]" />
            <h3 className="font-serif-dearly text-base font-bold text-[#581620]">
              Scrapbook Stickers
            </h3>
            <span className="text-xs text-[#7e695d] hidden sm:inline">
              (Click any sticker to place on your book)
            </span>
          </div>

          {/* Page Target Selector on Open Spreads */}
          <div className="flex items-center gap-2">
            {spreadPages.length > 1 && (
              <div className="flex items-center bg-[#ebdccd] p-0.5 rounded-lg text-xs">
                {spreadPages.map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setTargetPage(pg)}
                    className={`px-2.5 py-1 rounded-md font-serif-dearly transition-all cursor-pointer ${
                      targetPage === pg
                        ? "bg-[#581620] text-[#fff8ee] font-bold shadow-xs"
                        : "text-[#695447] hover:text-[#581620]"
                    }`}
                  >
                    Place on Page {pg} {pg === 4 ? "(Keepsake)" : ""}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveToolModal(null)}
              className="p-1.5 rounded-full hover:bg-[#ebdccb] text-[#695447] transition-colors cursor-pointer ml-1"
              aria-label="Close stickers"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {placedFeedback && (
          <div className="bg-[#e8f5e9] border-b border-[#c8e6c9] px-4 py-1.5 text-xs text-[#2e7d32] font-medium flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              {placedFeedback}
            </span>
            <span className="text-[11px] text-[#4caf50]">
              You can drag it anywhere on the page!
            </span>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 bg-[#f4ebe0] border-b border-[#e5d5c3] overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#581620] text-[#fff8ee] font-medium shadow-2xs"
                  : "bg-white/80 text-[#695447] hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sticker Catalog Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[46vh]">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {/* Custom Sticker Upload button */}
            <input
              ref={customStickerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomStickerUpload}
            />
            <button
              type="button"
              onClick={() => customStickerInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center p-2 rounded-xl aspect-square border-2 border-dashed border-[#9e2a2b]/50 bg-white hover:bg-[#faecee] transition-all cursor-pointer group shadow-2xs"
              title="Upload your own sticker from device"
            >
              <Upload className="w-5 h-5 text-[#9e2a2b] group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-semibold text-[#7a4149] text-center leading-tight">
                Upload from device
              </span>
            </button>

            {/* Sticker Elements */}
            {filteredStickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() => handlePlaceSticker(sticker)}
                className="relative flex flex-col items-center justify-center p-2 rounded-xl aspect-square bg-white hover:shadow-md hover:scale-105 border border-[#e4d6c5] transition-all cursor-pointer group"
                title={`Click to add "${sticker.name}" to Page ${targetPage}`}
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src={sticker.src}
                    alt={sticker.name}
                    fill
                    unoptimized
                    className="object-contain pointer-events-none group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[9px] text-[#695447] mt-1 truncate max-w-full text-center">
                  {sticker.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer tip */}
        <div className="px-5 py-2.5 bg-[#f8f1e5] border-t border-[#ebdccb] flex items-center justify-between text-xs text-[#7e695d]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span>Click any sticker to place on the page. Drag to move, or click to scale and rotate.</span>
          </span>
          <button
            type="button"
            onClick={() => setActiveToolModal(null)}
            className="px-4 py-1 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-medium cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

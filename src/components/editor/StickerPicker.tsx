"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { AVAILABLE_STICKERS, StickerOption } from "@/types/magazine";
import { useMagazineStore } from "@/store/useMagazineStore";
import { Plus, Check, Sparkles, Upload } from "lucide-react";

interface StickerPickerProps {
  currentSticker?: string;
  onSelectSticker?: (src: string) => void;
  label?: string;
}

const CATEGORIES = [
  "All",
  "Seals & Stamps",
  "Love & Romance",
  "Florals & Nature",
  "Cute Scrapbook",
  "Stars & Sparkles",
  "Craft & Clips",
];

export const StickerPicker: React.FC<StickerPickerProps> = ({
  currentSticker,
  onSelectSticker,
  label = "Choose Scrapbook Sticker",
}) => {
  const { currentPage, addPlacedSticker, setActiveToolModal } = useMagazineStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [placedFeedback, setPlacedFeedback] = useState<string | null>(null);
  const customStickerInputRef = useRef<HTMLInputElement>(null);

  const filteredStickers =
    selectedCategory === "All"
      ? AVAILABLE_STICKERS
      : AVAILABLE_STICKERS.filter((s) => s.category === selectedCategory);

  const handleStickerClick = (sticker: StickerOption) => {
    // 1. Add as a freeform placed sticker on the current page
    addPlacedSticker({
      pageIndex: currentPage,
      src: sticker.src,
      name: sticker.name,
      x: 50 + (Math.random() * 16 - 8),
      y: 50 + (Math.random() * 16 - 8),
      rotation: Math.round(Math.random() * 20 - 10),
      scale: 1,
    });

    // 2. Also update page-level sticker if callback provided
    if (onSelectSticker) {
      onSelectSticker(sticker.src);
    }

    setPlacedFeedback(`Placed "${sticker.name}" on Page ${currentPage === 0 ? "Cover" : currentPage}!`);
    setTimeout(() => setPlacedFeedback(null), 2200);

    // Hide tool sheet modal if open
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
            pageIndex: currentPage,
            src: customSrc,
            name: file.name.replace(/\.[^/.]+$/, ""),
            x: 50,
            y: 50,
            rotation: 0,
            scale: 1,
          });
          setPlacedFeedback(`Custom sticker added to Page ${currentPage === 0 ? "Cover" : currentPage}!`);
          setTimeout(() => setPlacedFeedback(null), 2200);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Header and status notification */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#5a483e] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#9e2a2b]" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-[#8c7768] font-mono">
          Page {currentPage === 0 ? "Cover" : currentPage} active
        </span>
      </div>

      {placedFeedback && (
        <div className="text-[11px] px-2.5 py-1 rounded bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] animate-fade-in flex items-center gap-1 font-medium">
          <Check className="w-3.5 h-3.5" />
          <span>{placedFeedback}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#581620] text-[#fff8ee] font-medium shadow-2xs"
                : "bg-[#eee2d3] text-[#695447] hover:bg-[#e4d4c2]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of stickers + Custom upload card */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2.5 bg-[#f4ece0] rounded-xl border border-[#dfd0be] max-h-56 overflow-y-auto">
        {/* Upload Custom Sticker button */}
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
          className="relative flex flex-col items-center justify-center p-1.5 rounded-lg aspect-square border border-dashed border-[#9e2a2b]/60 bg-white/70 hover:bg-[#faecee] transition-all cursor-pointer group"
          title="Upload your own sticker image from device"
        >
          <Upload className="w-5 h-5 text-[#9e2a2b] group-hover:scale-110 transition-transform mb-0.5" />
          <span className="text-[9px] font-medium text-[#7a4149] text-center leading-tight">
            Upload
          </span>
        </button>

        {/* Catalog stickers */}
        {filteredStickers.map((sticker: StickerOption) => {
          const isSelected = currentSticker === sticker.src;
          return (
            <button
              key={sticker.id}
              type="button"
              onClick={() => handleStickerClick(sticker)}
              className={`relative flex flex-col items-center justify-center p-1.5 rounded-lg aspect-square transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-white shadow-md ring-2 ring-[#9e2a2b] scale-105"
                  : "bg-white/70 hover:bg-white hover:shadow-xs hover:scale-105"
              }`}
              title={`Click to add "${sticker.name}" to page`}
              aria-label={sticker.name}
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src={sticker.src}
                  alt={sticker.name}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#9e2a2b] rounded-full flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#7d6759] bg-[#faf6ef] px-3 py-1.5 rounded-lg border border-[#ebdccf]">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
          <span>Click any sticker to place on current page</span>
        </span>
        <span className="font-mono text-[10px] text-[#9e2a2b]">Drag anywhere • Scale • Rotate</span>
      </div>
    </div>
  );
};

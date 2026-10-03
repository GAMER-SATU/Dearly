"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { MemoryPageData } from "@/types/magazine";
import { WashiTape } from "@/components/ui/WashiTape";
import { Upload, Camera, Heart } from "lucide-react";
import { useMagazineStore } from "@/store/useMagazineStore";

interface MemoryPageProps {
  data: MemoryPageData;
  onEditClick?: () => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({
  data,
  onEditClick,
}) => {
  const { updateMemoryPage, isReadOnly } = useMagazineStore();
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const stickerSrc = data.sticker || "/assets/stickers/postage-stamp.svg";
  const secondPhoto =
    data.secondPhotoUrl ||
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80";

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>, slot: 1 | 2) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (slot === 1) {
            updateMemoryPage({ featuredPhotoUrl: event.target.result as string });
          } else {
            updateMemoryPage({ secondPhotoUrl: event.target.result as string });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (slot === 1) {
            updateMemoryPage({ featuredPhotoUrl: event.target.result as string });
          } else {
            updateMemoryPage({ secondPhotoUrl: event.target.result as string });
          }
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = "";
  };

  return (
    <div className="relative w-full h-full pl-12 sm:pl-14 pr-16 sm:pr-18 pt-10 sm:pt-12 pb-10 sm:pb-12 flex flex-col justify-between overflow-hidden text-[#2c221e]">
      {/* Hidden file pickers for direct photo replacement */}
      {!isReadOnly && (
        <>
          <input
            ref={fileInputRef1}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, 1)}
          />
          <input
            ref={fileInputRef2}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, 2)}
          />
        </>
      )}

      {/* Dynamic Sticker in Top Right */}
      <div
        data-text-action={isReadOnly ? undefined : "1"}
        onClick={isReadOnly ? undefined : onEditClick}
        className={`absolute top-10 right-14 sm:right-16 w-12 sm:w-14 h-16 sm:h-18 transform rotate-3 select-none drop-shadow-xs ${
          isReadOnly ? "pointer-events-none" : "cursor-pointer hover:scale-105"
        } transition-transform z-20`}
        title={isReadOnly ? undefined : "Customize sticker or story"}
      >
        <Image
          src={stickerSrc}
          alt="Memory page sticker"
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Top Header Section (Clean headline, no AI slop chapter/date stamps) */}
      <div
        data-text-action={isReadOnly ? undefined : "1"}
        onClick={isReadOnly ? undefined : onEditClick}
        className={`relative z-10 pr-16 ${isReadOnly ? "" : "cursor-pointer group"}`}
        title={isReadOnly ? undefined : "Click to edit headline"}
      >
        <h2 className={`font-serif-dearly text-xl sm:text-2xl text-[#3b1c21] font-semibold tracking-tight leading-tight ${
          isReadOnly ? "" : "group-hover:text-[#9e2a2b]"
        } transition-colors`}>
          {data.headline}
        </h2>
      </div>

      {/* Main Alternating / Zig-Zag Scrapbook Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-around my-auto py-1 gap-2 sm:gap-3">
        {/* ROW 1: Small paragraph or text on LEFT, 1st Photo on TOP RIGHT */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Left: Direct text on the page, no card / no unwanted textlines */}
          <div
            data-text-action={isReadOnly ? undefined : "1"}
            onClick={isReadOnly ? undefined : onEditClick}
            className={`flex-1 p-2 ${
              isReadOnly ? "cursor-default" : "cursor-pointer group hover:bg-[#9e2a2b]/5"
            } rounded-sm transition-colors`}
            title={isReadOnly ? undefined : "Click to edit text"}
          >
            <p className="font-handwriting text-base sm:text-lg leading-relaxed text-[#2c221e] line-clamp-4">
              {data.introText ||
                "A sudden afternoon rainstorm caught us by surprise. We hurried under that tiny canvas awning, ordered warm cappuccinos, and spoke for hours."}
            </p>
          </div>

          {/* Right: 1st Photo (Top Right) */}
          <div
            data-photo-action={isReadOnly ? undefined : "memory-1"}
            onDragOver={
              isReadOnly
                ? undefined
                : (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverIndex(1);
                  }
            }
            onDragLeave={
              isReadOnly
                ? undefined
                : (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverIndex(null);
                  }
            }
            onDrop={isReadOnly ? undefined : (e) => handlePhotoDrop(e, 1)}
            onClick={isReadOnly ? undefined : () => fileInputRef1.current?.click()}
            className={`polaroid-frame w-[135px] sm:w-[160px] shrink-0 p-1.5 pb-2.5 shadow-sm bg-white transform rotate-1 ${
              isReadOnly ? "cursor-default" : "hover:rotate-0 cursor-pointer group"
            } transition-all duration-300 relative ${
              dragOverIndex === 1 && !isReadOnly ? "ring-2 ring-[#9e2a2b] scale-105" : ""
            }`}
            title={isReadOnly ? undefined : "Click or tap to choose photo from device"}
          >
            {/* Washi Tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <WashiTape rotate="-rotate-2" className="h-2.5 w-14 shadow-2xs" />
            </div>

            <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden rounded-[1px] bg-stone-200">
              {data.featuredPhotoUrl ? (
                <Image
                  src={data.featuredPhotoUrl}
                  alt={data.featuredPhotoCaption || "Top photo"}
                  fill
                  unoptimized
                  className={`object-cover transition-transform duration-300 ${
                    isReadOnly ? "" : "group-hover:scale-105"
                  }`}
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
                  <Upload className="w-5 h-5 text-[#9e2a2b]" />
                  <span className="text-[8px] mt-1 text-[#8c7769]">Drop photo</span>
                </div>
              )}

              {/* Hover overlay hint */}
              {!isReadOnly && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                  <Camera className="w-4 h-4 mb-0.5 text-white" />
                  <span className="text-[9px] font-sans font-medium leading-tight">
                    Tap to add photo
                  </span>
                </div>
              )}

              {/* Visual tap cue badge */}
              {!isReadOnly && (
                <div className="absolute bottom-1 right-1 z-20 pointer-events-none flex items-center gap-1 bg-[#1f060a]/80 text-[#f5d574] px-1.5 py-0.5 rounded-full shadow-md backdrop-blur-xs text-[8px] font-sans border border-[#d4af37]/40 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline font-medium">Tap photo</span>
                </div>
              )}
            </div>

            {data.featuredPhotoCaption && (
              <p className="font-handwriting text-xs text-center text-[#4a3a30] mt-1 leading-tight truncate px-0.5">
                {data.featuredPhotoCaption}
              </p>
            )}
          </div>
        </div>

        {/* ROW 2: 2nd Image on BOTTOM LEFT, Text on RIGHT */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Left: 2nd Photo (Bottom Left) */}
          <div
            data-photo-action={isReadOnly ? undefined : "memory-2"}
            onDragOver={
              isReadOnly
                ? undefined
                : (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverIndex(2);
                  }
            }
            onDragLeave={
              isReadOnly
                ? undefined
                : (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverIndex(null);
                  }
            }
            onDrop={isReadOnly ? undefined : (e) => handlePhotoDrop(e, 2)}
            onClick={isReadOnly ? undefined : () => fileInputRef2.current?.click()}
            className={`polaroid-frame w-[135px] sm:w-[160px] shrink-0 p-1.5 pb-2.5 shadow-sm bg-white transform -rotate-1 ${
              isReadOnly ? "cursor-default" : "hover:rotate-0 cursor-pointer group"
            } transition-all duration-300 relative ${
              dragOverIndex === 2 && !isReadOnly ? "ring-2 ring-[#9e2a2b] scale-105" : ""
            }`}
            title={isReadOnly ? undefined : "Click or tap to choose photo from device"}
          >
            {/* Washi Tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <WashiTape rotate="rotate-2" className="h-2.5 w-14 shadow-2xs" />
            </div>

            <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden rounded-[1px] bg-stone-200">
              {secondPhoto ? (
                <Image
                  src={secondPhoto}
                  alt={data.secondPhotoCaption || "Bottom photo"}
                  fill
                  unoptimized
                  className={`object-cover transition-transform duration-300 ${
                    isReadOnly ? "" : "group-hover:scale-105"
                  }`}
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
                  <Upload className="w-5 h-5 text-[#9e2a2b]" />
                  <span className="text-[8px] mt-1 text-[#8c7769]">Drop photo</span>
                </div>
              )}

              {/* Hover overlay hint */}
              {!isReadOnly && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                  <Camera className="w-4 h-4 mb-0.5 text-white" />
                  <span className="text-[9px] font-sans font-medium leading-tight">
                    Tap to add photo
                  </span>
                </div>
              )}

              {/* Visual tap cue badge */}
              {!isReadOnly && (
                <div className="absolute bottom-1 right-1 z-20 pointer-events-none flex items-center gap-1 bg-[#1f060a]/80 text-[#f5d574] px-1.5 py-0.5 rounded-full shadow-md backdrop-blur-xs text-[8px] font-sans border border-[#d4af37]/40 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline font-medium">Tap photo</span>
                </div>
              )}
            </div>

            <p className="font-handwriting text-xs text-center text-[#4a3a30] mt-1 leading-tight truncate px-0.5">
              {data.secondPhotoCaption || "Lukewarm cups & autumn rain."}
            </p>
          </div>

          {/* Right: Direct text on the page, no card / no unwanted textlines */}
          <div
            data-text-action={isReadOnly ? undefined : "1"}
            onClick={isReadOnly ? undefined : onEditClick}
            className={`flex-1 p-2 ${
              isReadOnly ? "cursor-default" : "cursor-pointer group hover:bg-[#9e2a2b]/5"
            } rounded-sm transition-colors`}
            title={isReadOnly ? undefined : "Click to edit story letter"}
          >
            <p className="font-handwriting text-base sm:text-lg leading-relaxed text-[#2c221e] line-clamp-4">
              {data.bodyLetter ||
                "Do you remember how the streetlamps began to flicker on outside? I knew right then that ordinary days with you would always feel like poetry."}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="relative z-10 flex justify-between items-center text-[10px] text-[#8c7769] font-serif-dearly pt-1">
        <span className="italic font-handwriting text-sm text-[#9e2a2b] flex items-center gap-1">
          A memory to hold dear <Heart className="w-3 h-3 fill-current inline" />
        </span>
        <span className="font-mono opacity-60">pg. 01</span>
      </div>
    </div>
  );
};

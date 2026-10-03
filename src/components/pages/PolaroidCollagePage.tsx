"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { PolaroidCollageData } from "@/types/magazine";
import { WashiTape } from "@/components/ui/WashiTape";
import { Upload, Camera, Heart } from "lucide-react";
import { useMagazineStore } from "@/store/useMagazineStore";

interface PolaroidCollagePageProps {
  data: PolaroidCollageData;
  onEditClick?: () => void;
}

export const PolaroidCollagePage: React.FC<PolaroidCollagePageProps> = ({
  data,
  onEditClick,
}) => {
  const { updatePolaroidItem, isReadOnly } = useMagazineStore();
  const [activeDropIndex, setActiveDropIndex] = useState<number | null>(null);
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const stickerSrc = data.sticker || "/assets/stickers/paper-clip.svg";

  const handleDropOnPolaroid = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveDropIndex(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updatePolaroidItem(index, { imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updatePolaroidItem(index, { imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = "";
  };

  return (
    <div className="relative w-full h-full pl-14 sm:pl-18 pr-14 sm:pr-18 pt-10 sm:pt-12 pb-10 sm:pb-12 flex flex-col justify-between overflow-hidden text-[#2c221e]">
      {/* Dynamic Selected Sticker */}
      <div
        data-text-action={isReadOnly ? undefined : "2"}
        onClick={isReadOnly ? undefined : onEditClick}
        className={`absolute top-10 right-10 w-11 h-16 z-30 select-none ${
          isReadOnly ? "pointer-events-none" : "cursor-pointer hover:scale-110"
        } transition-transform drop-shadow-xs`}
        title={isReadOnly ? undefined : "Customize sticker or polaroids"}
      >
        <Image
          src={stickerSrc}
          alt="Page sticker"
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Header (Clean, editable title & note) */}
      <div
        data-text-action={isReadOnly ? undefined : "2"}
        onClick={isReadOnly ? undefined : onEditClick}
        className={`relative z-10 pr-12 ${isReadOnly ? "" : "cursor-pointer group"}`}
        title={isReadOnly ? undefined : "Click to edit title and note"}
      >
        <h2 className={`font-serif-dearly text-xl sm:text-2xl text-[#3b1c21] font-semibold tracking-tight leading-tight ${
          isReadOnly ? "" : "group-hover:text-[#9e2a2b]"
        } transition-colors`}>
          {data.title}
        </h2>
        {data.note && (
          <p className="font-handwriting text-base text-[#786154] truncate mt-0.5">
            &quot;{data.note}&quot;
          </p>
        )}
      </div>

      {/* Single Photobooth Strip Frame (Photos one below another) */}
      <div className="relative z-10 flex-1 my-auto py-2 flex items-center justify-center">
        {/* Photobooth Strip Frame */}
        <div className="relative transform -rotate-0.5 hover:rotate-0 transition-transform duration-300">
          {/* Top Washi Tape anchoring the strip to the scrapbook page */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <WashiTape rotate="-rotate-2" className="h-3.5 w-20 shadow-xs" />
          </div>

          {/* Photobooth Paper Strip Container */}
          <div className="w-[185px] sm:w-[210px] bg-[#fdfbf9] border border-[#d6c7b5]/90 rounded-sm shadow-[0_8px_24px_rgba(40,25,15,0.16)] p-2.5 sm:p-3 flex flex-col">
            {/* Retro Photobooth Strip Header */}
            <div className="text-center pt-0.5 pb-1.5 border-b border-[#ebdccb]/70 mb-2">
              <span className="font-serif-dearly text-[8px] sm:text-[9px] tracking-[0.24em] uppercase text-[#8c6b54] font-bold">
                ✦ PHOTOBOOTH STRIP ✦
              </span>
            </div>

            {/* 3 Photos One Below Another */}
            <div className="flex flex-col gap-2">
              {data.polaroids.map((polaroid, index) => {
                const isHovered = activeDropIndex === index && !isReadOnly;
                return (
                  <div
                    key={polaroid.id || index}
                    data-photo-action={isReadOnly ? undefined : `polaroid-${index}`}
                    onDragOver={
                      isReadOnly
                        ? undefined
                        : (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveDropIndex(index);
                          }
                    }
                    onDragLeave={
                      isReadOnly
                        ? undefined
                        : (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveDropIndex(null);
                          }
                    }
                    onDrop={isReadOnly ? undefined : (e) => handleDropOnPolaroid(e, index)}
                    onClick={
                      isReadOnly
                        ? undefined
                        : () => fileInputRefs[index].current?.click()
                    }
                    className={`relative ${
                      isReadOnly ? "cursor-default" : "cursor-pointer group"
                    } transition-all duration-200 ${
                      isHovered ? "ring-2 ring-[#9e2a2b] rounded-xs scale-[1.02]" : ""
                    }`}
                    title={isReadOnly ? undefined : "Click or tap to choose photo from device"}
                  >
                    {!isReadOnly && (
                      <input
                        ref={fileInputRefs[index]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    )}

                    {/* Photo Box */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#ede6dc] border border-[#dfd2c4] rounded-[1px]">
                      <Image
                        src={polaroid.imageUrl}
                        alt={polaroid.caption || `Photobooth photo ${index + 1}`}
                        fill
                        unoptimized
                        className={`object-cover transition-transform duration-300 ${
                          isReadOnly ? "" : "group-hover:scale-105"
                        }`}
                        sizes="210px"
                      />

                      {/* Hover overlay hint */}
                      {!isReadOnly && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                          <Camera className="w-3.5 h-3.5 mb-0.5 text-white" />
                          <span className="text-[8px] font-sans font-medium leading-tight">
                            Tap to add photo
                          </span>
                        </div>
                      )}

                      {/* Visual tap cue badge */}
                      {!isReadOnly && (
                        <div className="absolute bottom-1 right-1 z-20 pointer-events-none flex items-center gap-1 bg-[#1f060a]/80 text-[#f5d574] px-1.5 py-0.5 rounded-full shadow-md backdrop-blur-xs text-[8px] font-sans border border-[#d4af37]/40 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-2 h-2" />
                          <span className="hidden sm:inline">Tap photo</span>
                        </div>
                      )}
                    </div>

                    {/* Handwritten Caption below photo */}
                    <p className="font-handwriting text-[11px] sm:text-xs text-center text-[#382821] mt-0.5 truncate px-0.5">
                      {polaroid.caption || `Snapshot #${index + 1}`}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Vintage Photobooth Strip Footer Tab */}
            <div className="text-center pt-2 mt-1.5 border-t border-[#ebdccb]/70 flex items-center justify-between px-1 text-[7px] sm:text-[8px] font-mono text-[#9c8474]">
              <span>VOL. 01</span>
              <span className="font-serif-dearly text-[8px] sm:text-[9px] text-[#9e2a2b] font-medium tracking-widest">
                DEARLY MEMORIES
              </span>
              <span>NO. 03</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-between items-center text-[10px] text-[#8c7769] font-serif-dearly pt-1">
        <span className="italic font-handwriting text-sm text-[#9e2a2b] flex items-center gap-1">
          Captured moments in time <Heart className="w-3 h-3 fill-current inline" />
        </span>
        <span className="font-mono opacity-60">pg. 02</span>
      </div>
    </div>
  );
};

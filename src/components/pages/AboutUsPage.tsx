"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { AboutUsData } from "@/types/magazine";
import { WashiTape } from "@/components/ui/WashiTape";
import { Upload, Camera, Pencil, Heart } from "lucide-react";
import { useMagazineStore } from "@/store/useMagazineStore";

interface AboutUsPageProps {
  data: AboutUsData;
  onEditClick?: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  data,
  onEditClick,
}) => {
  const { updateAboutUs, isReadOnly } = useMagazineStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOverPhoto, setIsDragOverPhoto] = useState(false);
  const stickerSrc = data.sticker || "/assets/stickers/flower-dried.svg";

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateAboutUs({ mainImageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateAboutUs({ mainImageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = "";
  };

  const storyText =
    data.storyParagraph ||
    data.storyQuote ||
    "We started with a simple hello and a shared warm cappuccino, having no idea our paths were about to intertwine so deeply. Every laugh, every late-night walk, and every quiet understanding since that day has built a story I will treasure forever.\n\nHere's to our chapters yet unwritten—full of warm light, gentle adventures, and a love that grows sweeter with every passing day.";

  return (
    <div className="relative w-full h-full pl-14 sm:pl-18 pr-14 sm:pr-18 pt-10 sm:pt-12 pb-10 sm:pb-12 flex flex-col justify-between overflow-hidden text-[#2c221e]">
      {/* Hidden file input */}
      {!isReadOnly && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {/* Top Sticker */}
      <div
        data-text-action={isReadOnly ? undefined : "3"}
        onClick={isReadOnly ? undefined : onEditClick}
        className={`absolute top-10 right-10 w-12 h-18 transform rotate-6 z-20 ${
          isReadOnly ? "pointer-events-none" : "cursor-pointer hover:scale-110"
        } transition-transform drop-shadow-xs`}
        title={isReadOnly ? undefined : "Customize sticker or story"}
      >
        <Image
          src={stickerSrc}
          alt="About page sticker"
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Header (Clean, editable title & subtitle) */}
      <div
        data-text-action={isReadOnly ? undefined : "3"}
        onClick={isReadOnly ? undefined : onEditClick}
        className={`relative z-10 pr-14 ${isReadOnly ? "" : "cursor-pointer group"}`}
        title={isReadOnly ? undefined : "Click to edit title and subtitle"}
      >
        <h2 className={`font-serif-dearly text-2xl sm:text-3xl text-[#3b1c21] font-semibold tracking-tight leading-tight ${
          isReadOnly ? "" : "group-hover:text-[#9e2a2b]"
        } transition-colors`}>
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="font-serif-dearly italic text-sm sm:text-xs text-[#7e6758] truncate mt-0.5">
            {data.subtitle}
          </p>
        )}
      </div>

      {/* Main Content: Image centered above text, then paragraph from center space to bottom */}
      <div className="relative z-10 flex-1 flex flex-col justify-between my-1 sm:my-2">
        {/* CENTERED IMAGE CARD (Above the text in the center) */}
        <div className="flex justify-center items-center pt-1 pb-1">
          <div
            data-photo-action={isReadOnly ? undefined : "aboutus-main"}
            onDragOver={
              isReadOnly
                ? undefined
                : (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOverPhoto(true);
                  }
            }
            onDragLeave={
              isReadOnly
                ? undefined
                : (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOverPhoto(false);
                  }
            }
            onDrop={isReadOnly ? undefined : handlePhotoDrop}
            onClick={isReadOnly ? undefined : () => fileInputRef.current?.click()}
            className={`relative ${
              isReadOnly ? "cursor-default" : "group cursor-pointer"
            } transform -rotate-0.5 ${
              isReadOnly ? "" : "hover:rotate-0"
            } transition-all duration-300 ${
              isDragOverPhoto && !isReadOnly ? "scale-105 ring-2 ring-[#9e2a2b] rounded-sm" : ""
            }`}
            title={isReadOnly ? undefined : "Click or tap to choose photo from device"}
          >
            {/* Washi Tape at Top */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <WashiTape rotate="-rotate-1" className="h-3 w-16 shadow-xs" />
            </div>

            {/* Keepsake Photo Frame */}
            <div className="w-[190px] sm:w-[220px] p-2 bg-[#fdfbf7] rounded-xs border border-[#decbb7] shadow-sm">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1px] bg-stone-200">
                {data.mainImageUrl ? (
                  <Image
                    src={data.mainImageUrl}
                    alt="Our Story Photo"
                    fill
                    unoptimized
                    className={`object-cover transition-transform duration-300 ${
                      isReadOnly ? "" : "group-hover:scale-105"
                    }`}
                    sizes="220px"
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
            </div>
          </div>
        </div>

        {/* STORY PARAGRAPH AREA (Direct text, no card container, no lined paper) */}
        <div
          data-text-action={isReadOnly ? undefined : "3"}
          onClick={isReadOnly ? undefined : onEditClick}
          className={`relative p-2 ${
            isReadOnly ? "cursor-default" : "cursor-pointer group hover:bg-[#9e2a2b]/5"
          } rounded-sm transition-colors my-auto`}
          title={isReadOnly ? undefined : "Click to edit your story paragraph"}
        >
          {/* Subtle Quote Banner */}
          {data.storyQuote && (
            <div className="border-l-2 border-[#9e2a2b]/70 pl-2.5 mb-2">
              <p className="font-serif-dearly italic text-sm sm:text-xs text-[#583f32] leading-snug">
                {data.storyQuote}
              </p>
            </div>
          )}

          {/* Heartfelt Story Paragraph */}
          <div className="overflow-y-auto max-h-[190px] sm:max-h-[210px] pr-1">
            <p className="font-handwriting text-lg sm:text-xl leading-[28px] sm:leading-[32px] text-[#2c201a] whitespace-pre-line">
              {storyText}
            </p>
          </div>

          {/* Handwritten Postscript Note */}
          {data.handwrittenNote && (
            <div className="border-t border-[#ebdccb]/70 pt-1.5 mt-2 flex items-center justify-between">
              <p className="font-handwriting text-sm sm:text-base text-[#9e2a2b] truncate font-medium">
                {data.handwrittenNote}
              </p>
              {!isReadOnly && (
                <span className="flex items-center gap-1 text-[9px] font-serif-dearly text-[#8c7769]/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="w-2.5 h-2.5 text-[#9e2a2b]" />
                  <span>Edit</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-between items-center text-[10px] text-[#8c7769] font-serif-dearly pt-1">
        <span className="italic font-handwriting text-sm text-[#9e2a2b] flex items-center gap-1">
          To many more chapters together <Heart className="w-3 h-3 fill-current inline" />
        </span>
        <span className="font-mono opacity-60">pg. 03</span>
      </div>
    </div>
  );
};

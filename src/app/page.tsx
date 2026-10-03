"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { DeskStickers } from "@/components/layout/DeskStickers";
import { StickersToolSheet } from "@/components/tools/StickersToolSheet";
import { ImageToolSheet } from "@/components/tools/ImageToolSheet";
import { TextToolSheet } from "@/components/tools/TextToolSheet";
import { ShareModal } from "@/components/modals/ShareModal";
import { useMagazineStore } from "@/store/useMagazineStore";
import { Heart, Eye, Pencil, Share2 } from "lucide-react";

// Dynamically load PageFlipMagazine with ssr: false for client-side canvas
const PageFlipMagazine = dynamic(
  () =>
    import("@/components/book/PageFlipMagazine").then(
      (mod) => mod.PageFlipMagazine
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-[550px] max-w-[90vw] h-[760px] max-h-[75vh] bg-[#581119] rounded-2xl shadow-2xl flex items-center justify-center border-2 border-[#681420] animate-pulse">
        <span className="font-serif-dearly text-sm text-[#e8cda2]">
          Opening your keepsake...
        </span>
      </div>
    ),
  }
);

export default function Home() {
  const { isReadOnly, setIsReadOnly, setActiveToolModal } = useMagazineStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenImage = () => {
    if (!isReadOnly) setActiveToolModal("image");
  };

  const handleOpenText = () => {
    if (!isReadOnly) setActiveToolModal("text");
  };

  const handleOpenStickers = () => {
    if (!isReadOnly) setActiveToolModal("stickers");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden py-3 sm:py-6 px-2 sm:px-4">
      {/* Scattered Scrapbook Stickers on the Kraft Table */}
      <DeskStickers />

      {/* Center Magazine & Title Workspace */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center my-auto py-1">
        {/* Showcase Mode Header Banner (When published or in showcase mode) */}
        {isReadOnly && (
          <div className="relative z-30 mb-3 flex items-center justify-between gap-3 px-4 py-1.5 rounded-full bg-[#fbf7f0]/95 backdrop-blur-md border border-[#d4af37]/60 shadow-md text-xs font-serif-dearly max-w-lg w-full animate-fade-in">
            <div className="flex items-center gap-1.5 text-[#581620]">
              <Eye className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <span className="font-semibold">Showcase Mode</span>
              <span className="hidden sm:inline text-[#7e695d] text-[11px]">
                (Read-Only Preview)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#581620] text-[#fff8ee] hover:bg-[#430f16] transition-colors cursor-pointer text-[11px]"
              >
                <Share2 className="w-3 h-3 text-[#f5d574]" />
                <span>Share Link</span>
              </button>
              <button
                type="button"
                onClick={() => setIsReadOnly(false)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#581620] border border-[#d4af37]/50 hover:bg-[#f8f1e5] transition-colors cursor-pointer text-[11px]"
              >
                <Pencil className="w-3 h-3 text-[#9e2a2b]" />
                <span>Edit Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Center Cursive Calligraphy Title (Positioned directly above the book) */}
        <header className="text-center mb-1.5 sm:mb-4 md:mb-5 px-3">
          <h1 className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1e1713] tracking-wide select-none drop-shadow-2xs leading-tight">
            For Your Dear's &amp; Loved ones
          </h1>
        </header>

        {/* Center Magazine Workspace with page-flip 3D book */}
        <main className="w-full flex flex-col items-center justify-center">
          <PageFlipMagazine
            readOnly={isReadOnly}
            onOpenImage={handleOpenImage}
            onOpenText={handleOpenText}
            onOpenStickers={handleOpenStickers}
            onOpenShare={() => setShowShareModal(true)}
          />
        </main>
      </div>

      {/* Direct Action Tools (Only rendered when in editing mode) */}
      {!isReadOnly && (
        <>
          <StickersToolSheet />
          <ImageToolSheet />
          <TextToolSheet />
        </>
      )}

      {/* 24-Hour Ephemeral Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageSelector } from "@/components/editor/PageSelector";
import { ContextualControls } from "@/components/editor/ContextualControls";
import { BookContainer } from "@/components/layout/BookContainer";
import { StickersToolSheet } from "@/components/tools/StickersToolSheet";
import { ImageToolSheet } from "@/components/tools/ImageToolSheet";
import { TextToolSheet } from "@/components/tools/TextToolSheet";
import { ShareModal } from "@/components/modals/ShareModal";
import { useMagazineStore } from "@/store/useMagazineStore";
import {
  Heart,
  Eye,
  Share2,
  SlidersHorizontal,
  Layers,
  ChevronLeft,
  Check,
  Link as LinkIcon,
} from "lucide-react";

export default function CreateMagazinePage() {
  const { currentPage, isReadOnly, setIsReadOnly } = useMagazineStore();
  const [mobileTab, setMobileTab] = useState<"preview" | "controls" | "pages">("preview");
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Sync with store isReadOnly if link was generated
  const activeShowcase = isPreviewMode || isReadOnly;

  return (
    <div className="h-screen flex flex-col bg-[#ebdcc9] text-[#2c221e] overflow-hidden">
      {/* Editor Top Navigation Bar */}
      <header className="h-14 bg-[#f8f1e5] border-b border-[#dfd2c0] flex items-center justify-between px-4 sm:px-6 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#735e51] hover:text-[#581620] transition-colors font-serif-dearly"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Reader</span>
          </Link>

          <div className="h-4 w-[1px] bg-[#d8c5b0]" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative">
              <Image
                src="/assets/stickers/heart-stamp.svg"
                alt="Dearly Icon"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif-dearly text-lg font-bold tracking-[0.14em] text-[#581620]">
              DEARLY
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#fae8dc] text-[#9e2a2b] font-medium border border-[#9e2a2b]/20">
              Studio
            </span>
          </div>
        </div>

        {/* Mobile View Switcher Buttons (Hidden during full showcase preview) */}
        {!activeShowcase && (
          <div className="flex md:hidden items-center bg-[#ebdccd] p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setMobileTab("pages")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                mobileTab === "pages" ? "bg-white text-[#581620] font-bold shadow-xs" : "text-[#695447]"
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1" />
              Pages
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                mobileTab === "preview" ? "bg-white text-[#581620] font-bold shadow-xs" : "text-[#695447]"
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("controls")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                mobileTab === "controls" ? "bg-white text-[#581620] font-bold shadow-xs" : "text-[#695447]"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1" />
              Edit
            </button>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !activeShowcase;
              setIsPreviewMode(next);
              setIsReadOnly(next);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif-dearly transition-all cursor-pointer ${
              activeShowcase
                ? "bg-[#581620] text-[#fff8ee] shadow-sm font-semibold"
                : "bg-[#fdfbf7] hover:bg-white text-[#581620] border border-[#d4af37]/40 shadow-2xs"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{activeShowcase ? "Exit Preview" : "Showcase Preview"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium bg-[#9e2a2b] hover:bg-[#831f20] text-[#fff6f0] shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Showcase Mode Floating Banner */}
      {activeShowcase && (
        <div className="bg-[#fbf7f0] border-b border-[#dfd2c0] px-4 py-1.5 flex items-center justify-between text-xs text-[#581620] z-30 animate-fade-in">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#9e2a2b]" />
            <span className="font-semibold font-serif-dearly">Showcase Mode Active</span>
            <span className="hidden sm:inline text-[#7e695d]">
              • Complete read-only preview. All editing controls and tools are locked.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsPreviewMode(false);
              setIsReadOnly(false);
            }}
            className="px-2.5 py-0.5 rounded-full bg-white border border-[#dfd0be] hover:bg-[#f8f1e5] font-serif-dearly text-[11px] font-medium transition-colors cursor-pointer"
          >
            Back to Editor
          </button>
        </div>
      )}

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Page Selector (Hidden in showcase preview) */}
        {!activeShowcase && (
          <div
            className={`w-64 shrink-0 h-full ${
              mobileTab === "pages" ? "flex flex-col w-full" : "hidden md:flex flex-col"
            }`}
          >
            <PageSelector />
          </div>
        )}

        {/* CENTER COLUMN: Live Magazine Viewer */}
        <div
          className={`flex-1 h-full overflow-y-auto flex flex-col items-center justify-center p-3 sm:p-6 bg-[#ebdcc9]/60 ${
            activeShowcase || mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="w-full max-w-5xl my-auto flex justify-center">
            <BookContainer readOnly={activeShowcase} />
          </div>
        </div>

        {/* RIGHT COLUMN: Contextual Controls for Current Page (Hidden in showcase preview) */}
        {!activeShowcase && (
          <div
            className={`w-full md:w-96 shrink-0 h-full ${
              mobileTab === "controls" ? "flex flex-col w-full" : "hidden md:flex flex-col"
            }`}
          >
            <ContextualControls />
          </div>
        )}
      </div>

      {/* 24-Hour Ephemeral Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Direct Action Tool Sheets (Hidden during showcase preview) */}
      {!activeShowcase && (
        <>
          <StickersToolSheet />
          <ImageToolSheet />
          <TextToolSheet />
        </>
      )}
    </div>
  );
}

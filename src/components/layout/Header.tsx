"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useMagazineStore } from "@/store/useMagazineStore";
import { Heart, Edit3, Eye, Share2, RotateCcw, Link as LinkIcon, Check, Clock } from "lucide-react";

export const Header: React.FC = () => {
  const { isEditing, toggleEditing, resetToDefault } = useMagazineStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <header className="w-full bg-[#ebdcc9]/90 backdrop-blur-xs border-b border-[#d8c5ae] sticky top-0 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image
                src="/assets/stickers/heart-stamp.svg"
                alt="Dearly Icon"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif-dearly text-xl sm:text-2xl font-bold tracking-[0.12em] text-[#581620]">
                DEARLY
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-serif-dearly italic text-[#846b5c]">
                — A Keepsake for Someone Special
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Reset to sample */}
            <button
              type="button"
              onClick={resetToDefault}
              className="p-2 text-[#7a6456] hover:text-[#581620] hover:bg-[#dfcdb7]/50 rounded-full transition-colors cursor-pointer"
              title="Reset to sample memories"
              aria-label="Reset memories"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Studio Editor Link */}
            <a
              href="/create"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-serif-dearly bg-[#fdfbf7] hover:bg-white text-[#581620] border border-[#d4af37]/60 shadow-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Studio Editor</span>
            </a>

            {/* Quick Edit Drawer Toggle */}
            <button
              type="button"
              onClick={toggleEditing}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-xs ${
                isEditing
                  ? "bg-[#581620] text-[#fbf6ed] hover:bg-[#430f16]"
                  : "bg-[#fbf7ee] hover:bg-[#fffdf9] text-[#581620] border border-[#d4af37]/50"
              }`}
            >
              {isEditing ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Quick Edit</span>
                </>
              )}
            </button>

            {/* Share Link Button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[#9e2a2b] hover:bg-[#862122] text-[#fff6f0] shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#fcfaf5] border border-[#d4af37]/40 rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#faecee] border border-[#9e2a2b]/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#9e2a2b] fill-[#9e2a2b]/20" />
              </div>
              <div>
                <h3 className="font-serif-dearly text-lg font-bold text-[#581620]">
                  Share Your Memory Magazine
                </h3>
                <p className="text-xs text-[#7e695d]">
                  Anyone with this link can view your digital keepsake.
                </p>
              </div>
            </div>

            <div className="bg-[#f3ebe0] p-3 rounded-lg border border-[#e2d5c3] flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 overflow-hidden text-xs text-[#524138] font-mono truncate">
                <LinkIcon className="w-3.5 h-3.5 shrink-0 text-[#9e2a2b]" />
                <span className="truncate">
                  {typeof window !== "undefined"
                    ? window.location.href
                    : "https://dearly.memory/m/dearly-sample-01"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>

            <div className="text-center text-[11px] text-[#8c786c] mb-5 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-[#9e2a2b]" />
              <span>24-Hour Ephemeral Link: Permanently auto-erased after 24 hours</span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-[#5c4a40] hover:bg-[#eadecc]/60 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

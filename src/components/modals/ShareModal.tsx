"use client";

import React, { useState } from "react";
import { useMagazineStore } from "@/store/useMagazineStore";
import { createShareableMagazine, ShareResult } from "@/lib/supabase/magazines";
import {
  Heart,
  Link as LinkIcon,
  Check,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { magazine, setIsReadOnly } = useMagazineStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareResult, setShareResult] = useState<ShareResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const result = await createShareableMagazine(magazine);
      setShareResult(result);
      setIsReadOnly(true); // Automatically lock into read-only showcase mode!
    } catch (err: any) {
      console.error("Failed to generate link:", err);
      setErrorMsg("Could not generate link. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareResult?.url) return;
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(shareResult.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formattedExpiry = shareResult?.expiresAt
    ? new Date(shareResult.expiresAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fcfaf5] border border-[#d4af37]/50 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative text-[#2c221e]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#ebdccb] text-[#695447] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#faecee] border border-[#9e2a2b]/25 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-[#9e2a2b] fill-[#9e2a2b]/20" />
          </div>
          <div>
            <h3 className="font-serif-dearly text-lg font-bold text-[#581620]">
              24-Hour Ephemeral Keepsake
            </h3>
            <p className="text-xs text-[#7e695d]">
              Create a private link that permanently auto-deletes in 24 hours.
            </p>
          </div>
        </div>

        {/* State 1: Before Generating Link */}
        {!shareResult && (
          <div className="space-y-4">
            <div className="bg-[#f8f2e7] p-3.5 rounded-xl border border-[#e5d5c0] space-y-2 text-xs text-[#5e493c]">
              <div className="flex items-center gap-2 font-medium text-[#581620]">
                <Clock className="w-4 h-4 text-[#9e2a2b]" />
                <span>24-Hour Ephemeral Storage Guarantee:</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-[11px] text-[#6d574a]">
                <li>Link automatically expires exactly <strong>24 hours</strong> from creation.</li>
                <li>All uploaded photos are removed from Supabase Cloud Storage.</li>
                <li>The memory magazine record is permanently deleted.</li>
              </ul>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                {errorMsg}
              </p>
            )}

            <button
              type="button"
              onClick={handleGenerateLink}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-serif-dearly font-semibold tracking-wide shadow-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#edd5ab]" />
                  <span>Uploading photos &amp; generating 24h link...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Generate 24-Hour Share Link</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* State 2: Link Generated */}
        {shareResult && (
          <div className="space-y-4 animate-fade-in">
            {/* 24-Hour Expiry Alert Banner */}
            <div className="bg-[#fff9e6] border border-[#e5ca72] p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#70561a]">
              <Clock className="w-4 h-4 shrink-0 text-[#9e2a2b] mt-0.5 animate-pulse" />
              <div>
                <p className="font-semibold text-[#581620]">
                  Link Active For 24 Hours Only
                </p>
                <p className="text-[11px] text-[#7a6438] mt-0.5">
                  Expires on <strong>{formattedExpiry}</strong>. After this, all images and data are permanently purged from storage.
                </p>
              </div>
            </div>

            {/* Link Box */}
            <div className="bg-[#f3ebe0] p-2.5 rounded-lg border border-[#e2d5c3] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden text-xs text-[#524138] font-mono truncate">
                <LinkIcon className="w-3.5 h-3.5 shrink-0 text-[#9e2a2b]" />
                <span className="truncate select-all">{shareResult.url}</span>
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

            {/* Showcase Mode Active Notice */}
            <div className="bg-[#faecee]/80 border border-[#9e2a2b]/25 p-2.5 rounded-lg flex items-center gap-2 text-xs text-[#581620]">
              <ShieldAlert className="w-4 h-4 text-[#9e2a2b] shrink-0" />
              <span className="text-[11px] leading-snug">
                <strong>Showcase Mode Active:</strong> Your keepsake is locked in read-only mode so nobody can edit your memories when opening the link.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={shareResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg border border-[#dfd0be] text-xs font-medium text-[#581620] hover:bg-[#f8f1e5] transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 rounded-lg bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-medium transition-colors cursor-pointer"
              >
                View Showcase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

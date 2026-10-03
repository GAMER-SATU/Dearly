"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getShareableMagazine, FetchMagazineResult } from "@/lib/supabase/magazines";
import { useMagazineStore } from "@/store/useMagazineStore";
import { DeskStickers } from "@/components/layout/DeskStickers";
import { Clock, Heart, AlertCircle, Sparkles, BookOpen } from "lucide-react";

// Dynamically load PageFlipMagazine client-side
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
          Opening shared keepsake...
        </span>
      </div>
    ),
  }
);

interface SharedMagazinePageProps {
  params: Promise<{ id: string }>;
}

export default function SharedMagazinePage({ params }: SharedMagazinePageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { setMagazine, setIsReadOnly } = useMagazineStore();
  const [loading, setLoading] = useState(true);
  const [fetchResult, setFetchResult] = useState<FetchMagazineResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsReadOnly(true);

    async function load() {
      setLoading(true);
      const res = await getShareableMagazine(id);
      if (!isMounted) return;

      setFetchResult(res);
      if (res.data && !res.isExpired) {
        setMagazine(res.data);
      }
      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
      setIsReadOnly(false);
    };
  }, [id, setMagazine, setIsReadOnly]);

  // Live countdown timer for 24-hour expiration
  useEffect(() => {
    if (!fetchResult?.expiresAt || fetchResult.isExpired) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(fetchResult.expiresAt!).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft(null);
        setFetchResult((prev) => (prev ? { ...prev, isExpired: true } : null));
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchResult?.expiresAt, fetchResult?.isExpired]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#ebdcc9] flex flex-col items-center justify-center p-4 text-[#2c221e]">
        <div className="w-12 h-12 relative animate-spin mb-4">
          <Heart className="w-12 h-12 text-[#9e2a2b] fill-[#9e2a2b]/30" />
        </div>
        <p className="font-serif-dearly text-base text-[#581620]">
          Loading your private keepsake...
        </p>
      </div>
    );
  }

  // EXPIRED STATE (More than 24 hours have passed)
  if (!fetchResult?.data || fetchResult.isExpired) {
    return (
      <div className="min-h-screen bg-[#ebdcc9] flex flex-col items-center justify-center p-4 text-[#2c221e] relative overflow-hidden">
        <DeskStickers />
        <div className="relative z-10 bg-[#fdfbf7] border-2 border-[#decbb7] rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#faebea] border-2 border-[#9e2a2b]/30 flex items-center justify-center mx-auto text-[#9e2a2b]">
            <Clock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#f3e6d8] text-[#8c6b54] font-semibold">
              24-Hour Ephemeral Link
            </span>
            <h1 className="font-serif-dearly text-2xl font-bold text-[#581620] mt-2 mb-1">
              This Keepsake Has Expired
            </h1>
            <p className="text-xs text-[#7e695d] leading-relaxed">
              This memory magazine was shared with a strict 24-hour lifespan.
              For privacy, all uploaded photos and words have been automatically
              and permanently erased from cloud storage.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-serif-dearly font-semibold tracking-wide shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Create Your Own Dearly Keepsake</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE UNEXPIRED STATE (Within 24 hours)
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#ebdcc9] text-[#2c221e] py-3 sm:py-5 px-3">
      <DeskStickers />

      {/* Top Banner: Expiration Countdown & Info */}
      <header className="relative z-30 max-w-4xl w-full mx-auto flex items-center justify-between bg-[#fbf7f0]/95 backdrop-blur-xs px-4 py-2 rounded-full border border-[#d4af37]/40 shadow-xs text-xs mb-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-serif-dearly text-sm font-bold text-[#581620] hover:opacity-80 transition-opacity"
        >
          <Heart className="w-4 h-4 text-[#9e2a2b] fill-[#9e2a2b]/30" />
          <span>DEARLY</span>
        </Link>

        {timeLeft && (
          <div className="flex items-center gap-1.5 text-xs text-[#785b20] bg-[#fff8e7] px-3 py-1 rounded-full border border-[#f0de9d]">
            <Clock className="w-3.5 h-3.5 text-[#9e2a2b] animate-pulse" />
            <span>
              Expires in:{" "}
              <strong>
                {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </strong>
            </span>
          </div>
        )}

        <Link
          href="/create"
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-serif-dearly text-[#581620] hover:underline"
        >
          <BookOpen className="w-3 h-3 text-[#9e2a2b]" />
          <span>Create Yours</span>
        </Link>
      </header>

      {/* Center Magazine Viewer - 100% Read-Only Showcase */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center my-auto py-1">
        <PageFlipMagazine
          readOnly={true}
          onOpenShare={() => {
            if (typeof window !== "undefined") {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2500);
            }
          }}
        />
        {copiedLink && (
          <div className="fixed bottom-12 z-50 px-4 py-2 rounded-full bg-[#1f060a] text-[#f5d574] text-xs font-serif-dearly shadow-xl border border-[#d4af37]/40 flex items-center gap-1.5 animate-fade-in">
            <Heart className="w-3.5 h-3.5 fill-[#f5d574]" />
            <span>Link copied to clipboard!</span>
          </div>
        )}
      </main>

      {/* Reader Footer Notice */}
      <footer className="relative z-20 text-center text-[11px] text-[#735e51] font-serif-dearly pt-2 opacity-80 flex items-center justify-center gap-1">
        <span>A shared digital memory on Dearly • Links self-destruct after 24 hours</span>
        <Heart className="w-3 h-3 text-[#9e2a2b] fill-[#9e2a2b]/30 inline" />
      </footer>
    </div>
  );
}

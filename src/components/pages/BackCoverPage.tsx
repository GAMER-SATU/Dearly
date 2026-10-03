import React from "react";
import Image from "next/image";
import { BackCoverData } from "@/types/magazine";
import { Heart, Sparkles } from "lucide-react";

interface BackCoverPageProps {
  data: BackCoverData;
  onEditClick?: () => void;
}

export const BackCoverPage: React.FC<BackCoverPageProps> = ({
  data,
  onEditClick,
}) => {
  const stickerSrc = data.sticker || "/assets/stickers/wax-seal.svg";

  return (
    <div className="relative w-full h-full pl-10 sm:pl-12 pr-24 sm:pr-28 pt-12 sm:pt-14 pb-12 sm:pb-14 flex flex-col justify-between overflow-hidden text-[#f7e6ca]">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#d8b577] font-serif-dearly opacity-90 drop-shadow-xs">
          The Final Note
        </span>
        <div className="flex items-center gap-1.5 text-[11px] text-[#f2d06b]">
          <Heart className="w-3 h-3 fill-[#f2d06b]/30" />
          <span className="font-serif-dearly tracking-widest uppercase">
            End of Issue
          </span>
        </div>
      </div>

      {/* Centerpiece: Closing Note, Signature & Wax Seal */}
      <div className="relative z-10 my-auto text-center flex flex-col items-center px-4">
        <p className="font-serif-dearly italic text-lg sm:text-xl text-[#edd5ab] leading-relaxed mb-4 font-normal max-w-sm drop-shadow-xs">
          &quot;{data.closingQuote}&quot;
        </p>

        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-2" />

        <div className="my-3">
          <p className="font-handwriting text-3xl sm:text-4xl text-[#fff5e0] whitespace-pre-line tracking-wide drop-shadow-md">
            {data.signature}
          </p>
        </div>

        {/* Centerpiece Wax Seal Emblem & Secret Note */}
        <div className="mt-3 flex flex-col items-center">
          <div className="w-16 h-16 relative drop-shadow-2xl">
            <Image
              src={stickerSrc}
              alt="Wax seal"
              fill
              unoptimized
              className="object-contain"
            />
          </div>

          {data.secretMessage && (
            <div className="mt-3.5 px-4 py-2 bg-[#1f060a]/75 backdrop-blur-[2px] rounded-lg border border-[#d4af37]/35 shadow-lg max-w-xs text-center">
              <div className="flex items-center justify-center gap-1.5 text-[#f5d574] mb-0.5">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span className="text-[9px] font-mono tracking-wider uppercase opacity-90">
                  Secret Note
                </span>
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
              </div>
              <p className="font-handwriting text-lg sm:text-xl text-[#fff5e0] leading-snug">
                {data.secretMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-between items-center text-[11px] text-[#d8b577] font-serif-dearly pt-2 opacity-90">
        <span className="italic font-handwriting text-lg text-[#f5d574] flex items-center gap-1">
          Forever Dearly <Heart className="w-3.5 h-3.5 fill-current inline" />
        </span>
        <span className="font-serif-dearly uppercase tracking-widest text-[9px] text-[#e8cda2]">
          DEARLY MEMORIES
        </span>
      </div>
    </div>
  );
};

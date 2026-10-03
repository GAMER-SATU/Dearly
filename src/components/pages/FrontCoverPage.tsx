import React from "react";
import Image from "next/image";
import { FrontCoverData } from "@/types/magazine";
import { Heart } from "lucide-react";

interface FrontCoverPageProps {
  data: FrontCoverData;
  onEditClick?: () => void;
}

export const FrontCoverPage: React.FC<FrontCoverPageProps> = ({
  data,
  onEditClick,
}) => {
  const stickerSrc = data.sticker || "/assets/stickers/wax-seal.svg";

  return (
    <div className="relative w-full h-full pl-22 sm:pl-26 pr-10 sm:pr-12 pt-12 sm:pt-14 pb-12 sm:pb-14 flex flex-col justify-between overflow-hidden text-[#f7e6ca]">
      {/* Top Header Tag / Edition */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] tracking-widest uppercase font-serif-dearly bg-[#1f060a]/70 text-[#f0d499] border border-[#d4af37]/40 shadow-xs backdrop-blur-[1px]">
          Limited Edition
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#e2c185] font-serif-dearly drop-shadow-xs">
          {data.issueDate}
        </span>
      </div>

      {/* Centerpiece: Gold Foil Embossed Title & Subtitle */}
      <div className="relative z-10 my-auto text-center flex flex-col items-center px-2">
        {/* Decorative crest */}
        <div className="w-10 h-10 rounded-full border border-[#d4af37]/50 flex items-center justify-center mb-3 bg-[#26080e]/60 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)] backdrop-blur-[1px]">
          <Heart className="w-4 h-4 text-[#f5d574] fill-[#f5d574]/20" />
        </div>

        <h1 className="font-serif-dearly text-3xl sm:text-4xl font-normal tracking-[0.16em] uppercase gold-emboss select-none mb-1.5 leading-tight drop-shadow-md">
          {data.title}
        </h1>

        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#e5c178] to-transparent my-1" />

        <p className="font-serif-dearly text-xs sm:text-sm tracking-[0.14em] text-[#edd5ab] uppercase opacity-95 mt-1 drop-shadow-xs">
          {data.subtitle}
        </p>

        {/* Dynamic Selected Sticker Accent */}
        <div
          className={`mt-5 relative ${
            onEditClick ? "group cursor-pointer" : "pointer-events-none"
          }`}
          onClick={onEditClick}
          title={onEditClick ? "Click to customize cover" : undefined}
        >
          <div className="w-16 h-16 relative transform rotate-6 transition-transform group-hover:scale-110 drop-shadow-xl">
            <Image
              src={stickerSrc}
              alt="Cover sticker"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Bottom Dedication (Handwritten Script) */}
      <div className="relative z-10 text-center px-1">
        <div className="bg-[#1f060a]/65 backdrop-blur-[2px] px-3.5 py-2 rounded-md border border-[#d4af37]/30 inline-block w-full max-w-xs shadow-md">
          <p className="font-handwriting text-lg sm:text-xl text-[#fff5e0] leading-snug tracking-wide">
            &quot;{data.dedication}&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

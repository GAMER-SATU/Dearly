import React from "react";
import Image from "next/image";

export const DeskStickers: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* Top-Left: Yellow Stitched Star */}
      <div className="absolute top-8 left-4 sm:top-12 sm:left-10 md:left-14 w-16 h-16 sm:w-20 sm:h-20 transform -rotate-6 drop-shadow-md">
        <Image
          src="/assets/stickers/star-yellow.svg"
          alt="Yellow Star Sticker"
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Mid-Left: Typewriter Quote Paper Scrap */}
      <div className="absolute top-[48%] -translate-y-1/2 left-2 sm:left-6 md:left-8 w-32 sm:w-40 md:w-48 transform -rotate-3 drop-shadow-md">
        <Image
          src="/assets/stickers/quote-lovesongs.svg"
          alt="Love songs quote tape"
          width={190}
          height={85}
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Bottom-Left: Red Stitched Star */}
      <div className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 md:left-20 w-16 h-16 sm:w-20 sm:h-20 transform rotate-12 drop-shadow-md">
        <Image
          src="/assets/stickers/star-red.svg"
          alt="Red Star Sticker"
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Top-Right: Sunflower Bouquet */}
      <div className="absolute top-6 right-4 sm:top-10 sm:right-10 md:right-14 w-20 h-28 sm:w-24 sm:h-32 transform rotate-12 drop-shadow-lg">
        <Image
          src="/assets/stickers/sunflower-bouquet.svg"
          alt="Sunflower bouquet"
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      {/* Bottom-Right: Double Golden Sparkles */}
      <div className="absolute bottom-8 right-6 sm:bottom-14 sm:right-12 md:right-18 w-16 h-20 sm:w-20 sm:h-24 drop-shadow-md">
        <Image
          src="/assets/stickers/sparkle-double.svg"
          alt="Golden sparkles"
          fill
          unoptimized
          className="object-contain"
        />
      </div>
    </div>
  );
};

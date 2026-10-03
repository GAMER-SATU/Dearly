"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useMagazineStore } from "@/store/useMagazineStore";

// Dynamically load PageFlipMagazine with ssr: false for client-side canvas rendering
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

interface BookContainerProps {
  onOpenImage?: () => void;
  onOpenText?: () => void;
  onOpenStickers?: () => void;
  onOpenShare?: () => void;
  readOnly?: boolean;
}

export const BookContainer: React.FC<BookContainerProps> = ({
  onOpenImage,
  onOpenText,
  onOpenStickers,
  onOpenShare,
  readOnly,
}) => {
  const { setActiveToolModal } = useMagazineStore();

  const handleOpenImage = () => {
    if (onOpenImage) onOpenImage();
    else setActiveToolModal("image");
  };

  const handleOpenText = () => {
    if (onOpenText) onOpenText();
    else setActiveToolModal("text");
  };

  const handleOpenStickers = () => {
    if (onOpenStickers) onOpenStickers();
    else setActiveToolModal("stickers");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-2">
      <PageFlipMagazine
        readOnly={readOnly}
        onOpenImage={handleOpenImage}
        onOpenText={handleOpenText}
        onOpenStickers={handleOpenStickers}
        onOpenShare={onOpenShare}
      />
    </div>
  );
};

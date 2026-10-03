import React from "react";
import Image from "next/image";

interface SpiralBindingProps {
  ringsCount?: number;
  className?: string;
}

export const SpiralBinding: React.FC<SpiralBindingProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`pointer-events-none select-none z-30 ${className}`}
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        <Image
          src="/pages/spiral_center.png"
          alt="Spiral binding"
          fill
          unoptimized
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
};

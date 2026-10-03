import React from "react";
import { cn } from "@/lib/utils";

interface WashiTapeProps {
  className?: string;
  color?: string; // e.g., 'bg-amber-100/70'
  rotate?: string; // e.g., '-rotate-2'
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  className,
  color = "bg-[#f5e6d3]/85",
  rotate = "-rotate-1",
}) => {
  return (
    <div
      className={cn(
        "h-4 w-20 shadow-xs backdrop-blur-[0.5px] border-y border-amber-900/10 pointer-events-none z-10",
        color,
        rotate,
        className
      )}
      style={{
        clipPath:
          "polygon(0% 0%, 97% 2%, 100% 95%, 96% 100%, 3% 98%, 0% 10%)",
      }}
    />
  );
};

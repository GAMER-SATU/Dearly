"use client";

import React from "react";
import { useMagazineStore } from "@/store/useMagazineStore";
import { BookMarked, FileText, Image as ImageIcon, Users, Award, RotateCcw, Feather } from "lucide-react";

export const PageSelector: React.FC = () => {
  const { currentPage, setCurrentPage, resetToDefault } = useMagazineStore();

  const pages = [
    {
      index: 0,
      title: "Cover",
      subtitle: "Burgundy velvet & gold foil",
      icon: BookMarked,
    },
    {
      index: 1,
      title: "Page 1",
      subtitle: "Memory letter & photo",
      icon: FileText,
    },
    {
      index: 2,
      title: "Page 2",
      subtitle: "3 Polaroid snapshots",
      icon: ImageIcon,
    },
    {
      index: 3,
      title: "Page 3",
      subtitle: "Couple portrait & story",
      icon: Users,
    },
    {
      index: 4,
      title: "Page 4",
      subtitle: "Blank Keepsake page",
      icon: Feather,
    },
    {
      index: 5,
      title: "Back Cover",
      subtitle: "The Final Note & wax seal",
      icon: Award,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8f1e5] border-r border-[#dfd2c0] select-none">
      {/* Top Header */}
      <div className="p-4 border-b border-[#ebdccb]">
        <h3 className="text-xs font-serif-dearly uppercase tracking-[0.2em] text-[#8c6d57] font-semibold">
          Magazine Pages
        </h3>
        <p className="text-[11px] text-[#786154]">
          6-Page Scrapbook Keepsake
        </p>
      </div>

      {/* Page List */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {pages.map((p) => {
          const isActive = currentPage === p.index;
          const IconComponent = p.icon;

          return (
            <button
              key={p.index}
              type="button"
              onClick={() => setCurrentPage(p.index)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 border ${
                isActive
                  ? "bg-[#581620] text-[#fff8ee] border-[#581620] shadow-md scale-[1.02]"
                  : "bg-[#fdfbf7] hover:bg-[#fffdf9] text-[#4a3930] border-[#e4d6c4] shadow-2xs"
              }`}
            >
              {/* Page Number & Icon badge */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive
                    ? "bg-[#3e0d14] text-[#f2d06b] border border-[#d4af37]/30"
                    : "bg-[#f0e4d4] text-[#701c25]"
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Page Titles */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-serif-dearly text-sm font-semibold truncate ${
                      isActive ? "text-[#fff8ee]" : "text-[#34241d]"
                    }`}
                  >
                    {p.title}
                  </span>
                  {isActive && (
                    <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-full bg-[#f2d06b] text-[#3e0d14] font-bold">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] truncate ${
                    isActive ? "text-[#f3decf]" : "text-[#7a6557]"
                  }`}
                >
                  {p.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Reset All */}
      <div className="p-3 border-t border-[#ebdccb] bg-[#f4ebe0]">
        <button
          type="button"
          onClick={resetToDefault}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-serif-dearly text-[#6e584a] hover:text-[#581620] hover:bg-[#ebdccb] rounded-lg transition-colors cursor-pointer border border-[#dfd0be]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Memories</span>
        </button>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMagazineStore } from "@/store/useMagazineStore";
import { WashiTape } from "@/components/ui/WashiTape";
import {
  Image as ImageIcon,
  X,
  Plus,
  Upload,
  Sparkles,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const ImageToolSheet: React.FC = () => {
  const {
    activeToolModal,
    setActiveToolModal,
    currentPage,
    magazine,
    updateMemoryPage,
    updatePolaroidItem,
    updateAboutUs,
    addPlacedImage,
  } = useMagazineStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCover = currentPage === 0;
  const isBack = currentPage >= 5;
  const spreadPages = isCover
    ? [0]
    : isBack
    ? [5]
    : currentPage <= 2
    ? [1, 2]
    : [3, 4];

  // Default target page to current page or first in spread
  const [targetPage, setTargetPage] = useState<number>(() => {
    return spreadPages.includes(currentPage) ? currentPage : spreadPages[0];
  });

  useEffect(() => {
    if (activeToolModal === "image") {
      const defaultPage = spreadPages.includes(currentPage)
        ? currentPage
        : spreadPages[0];
      setTargetPage(defaultPage);
      setSelectedImage(null);
      setCaption("");
    }
  }, [activeToolModal, currentPage]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [frameStyle, setFrameStyle] = useState<"polaroid" | "clean">("polaroid");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdvancedSlots, setShowAdvancedSlots] = useState(false);

  if (activeToolModal !== "image") return null;

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (e.target) e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleAddPhotoToBook = () => {
    if (!selectedImage) return;

    addPlacedImage({
      pageIndex: targetPage,
      src: selectedImage,
      caption: caption.trim() || undefined,
      x: 50 + (Math.random() * 8 - 4),
      y: 50 + (Math.random() * 8 - 4),
      rotation: Math.round(Math.random() * 8 - 4),
      scale: 1,
    });

    // Close modal immediately so the user sees their photo on the book
    setActiveToolModal(null);
  };

  const pageName =
    targetPage === 0
      ? "Front Cover"
      : targetPage === 1
      ? "Page 1 (Memory)"
      : targetPage === 2
      ? "Page 2 (Photobooth)"
      : targetPage === 3
      ? "Page 3 (Our Story)"
      : targetPage === 4
      ? "Page 4 (Keepsake)"
      : "Back Cover";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-[2px] animate-fade-in">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className="bg-[#fdfbf7] border-t-2 sm:border border-[#d4af37]/60 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[88vh] text-[#2c221e]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#ebdccb] bg-[#f8f1e5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#faecee] border border-[#9e2a2b]/20 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-[#9e2a2b]" />
            </div>
            <div>
              <h3 className="font-serif-dearly text-base font-bold text-[#581620]">
                Add Photo to Book
              </h3>
              <p className="text-[11px] text-[#7e695d]">
                Adds a movable photo you can drag anywhere on Page 1 or Page 2
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveToolModal(null)}
            className="p-1.5 rounded-full hover:bg-[#ebdccb] text-[#695447] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Target Page Selector */}
          {spreadPages.length > 1 && (
            <div className="flex items-center justify-between bg-[#f5ecdf] p-1.5 rounded-lg border border-[#e2d5c3]">
              <span className="text-xs font-serif-dearly text-[#581620] font-semibold pl-1.5">
                Place photo on:
              </span>
              <div className="flex items-center gap-1">
                {spreadPages.map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setTargetPage(pg)}
                    className={`px-3 py-1 rounded-md text-xs font-serif-dearly transition-all cursor-pointer ${
                      targetPage === pg
                        ? "bg-[#581620] text-[#fff8ee] font-bold shadow-xs"
                        : "text-[#695447] hover:text-[#581620]"
                    }`}
                  >
                    Page {pg} {pg === 1 ? "(Left)" : pg === 2 ? "(Right)" : pg === 3 ? "(Story)" : "(Keepsake)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* UPLOAD / DROPZONE BOX */}
          {!selectedImage ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragOver
                  ? "border-[#9e2a2b] bg-[#faecee]/50 scale-[1.01]"
                  : "border-[#d8c5b0] hover:border-[#9e2a2b] hover:bg-[#fbf5ee]"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-[#faecee] border border-[#9e2a2b]/20 flex items-center justify-center text-[#9e2a2b] shadow-xs">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="font-serif-dearly text-base font-semibold text-[#581620]">
                  Click to Choose a Photo from Your Device
                </p>
                <p className="text-xs text-[#8c7769] mt-0.5">
                  or drag and drop an image file here
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-medium shadow-xs transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>Browse Photos</span>
              </div>
            </div>
          ) : (
            /* PREVIEW SELECTED PHOTO */
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#f7efe4] p-4 rounded-xl border border-[#decbb7] flex flex-col items-center justify-center">
                {/* Polaroid Frame Preview */}
                <div className="relative transform -rotate-1 shadow-md bg-white p-2.5 pb-4 rounded-[2px] border border-stone-200 w-[180px]">
                  {/* Washi Tape */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <WashiTape rotate="-rotate-1" className="h-3 w-16" />
                  </div>

                  <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden rounded-[1px]">
                    <Image
                      src={selectedImage}
                      alt="Photo preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {caption && (
                    <p className="font-handwriting text-xs text-center text-[#3e2e26] mt-2 px-1 truncate leading-tight">
                      {caption}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-xs text-[#9e2a2b] hover:underline font-medium cursor-pointer"
                >
                  Choose a different photo
                </button>
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Handwritten Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Our favorite sunset together"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-base"
                />
              </div>

              {/* Action Button: Add to Page */}
              <button
                type="button"
                onClick={handleAddPhotoToBook}
                className="w-full py-3 px-4 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-serif-dearly font-semibold tracking-wide shadow-md transition-all hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>Place Photo on {pageName}</span>
              </button>
            </div>
          )}

          {/* Secondary Collapsible: Replace Background Template Photos */}
          <div className="pt-2 border-t border-[#ebdccb]">
            <button
              type="button"
              onClick={() => setShowAdvancedSlots(!showAdvancedSlots)}
              className="w-full flex items-center justify-between text-xs text-[#7e695d] hover:text-[#581620] transition-colors py-1 cursor-pointer"
            >
              <span>Need to change the background photos instead?</span>
              {showAdvancedSlots ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showAdvancedSlots && (
              <div className="mt-3 p-3 bg-[#fbf7f0] rounded-xl border border-[#decbb7] space-y-3 animate-fade-in text-xs">
                <p className="text-[#695447]">
                  Tip: You can also click or drop photos directly onto the background frames right on the open book!
                </p>

                {targetPage === 1 && (
                  <div className="space-y-2">
                    <span className="font-semibold text-[#581620]">
                      Page 1 Background Photo Slots:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e: any) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                if (ev.target?.result) {
                                  updateMemoryPage({ featuredPhotoUrl: ev.target.result as string });
                                  setActiveToolModal(null);
                                }
                              };
                              r.readAsDataURL(f);
                            }
                          };
                          input.click();
                        }}
                        className="flex-1 py-1.5 px-2 bg-white border border-[#dfd0be] rounded-md text-center hover:bg-[#f8f1e5] cursor-pointer"
                      >
                        Top Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e: any) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                if (ev.target?.result) {
                                  updateMemoryPage({ secondPhotoUrl: ev.target.result as string });
                                  setActiveToolModal(null);
                                }
                              };
                              r.readAsDataURL(f);
                            }
                          };
                          input.click();
                        }}
                        className="flex-1 py-1.5 px-2 bg-white border border-[#dfd0be] rounded-md text-center hover:bg-[#f8f1e5] cursor-pointer"
                      >
                        Bottom Photo
                      </button>
                    </div>
                  </div>
                )}

                {targetPage === 2 && (
                  <div className="space-y-2">
                    <span className="font-semibold text-[#581620]">
                      Page 2 Photobooth Strip Slots:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[0, 1, 2].map((idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e: any) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => {
                                  if (ev.target?.result) {
                                    updatePolaroidItem(idx, { imageUrl: ev.target.result as string });
                                    setActiveToolModal(null);
                                  }
                                };
                                r.readAsDataURL(f);
                              }
                            };
                            input.click();
                          }}
                          className="py-1.5 px-2 bg-white border border-[#dfd0be] rounded-md text-center hover:bg-[#f8f1e5] cursor-pointer"
                        >
                          Slot #{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#f8f1e5] border-t border-[#ebdccb] flex items-center justify-between text-xs text-[#7e695d]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span>You can drag and move your photo anywhere across Page 1 &amp; Page 2!</span>
          </span>
          <button
            type="button"
            onClick={() => setActiveToolModal(null)}
            className="px-4 py-1 rounded-full text-xs font-medium text-[#5c4a40] hover:bg-[#eadecc]/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

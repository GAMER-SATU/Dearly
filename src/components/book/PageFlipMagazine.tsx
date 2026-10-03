"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { PageFlip, type SizeType } from "page-flip";
import Image from "next/image";
import { useMagazineStore } from "@/store/useMagazineStore";
import { FrontCoverPage } from "@/components/pages/FrontCoverPage";
import { MemoryPage } from "@/components/pages/MemoryPage";
import { PolaroidCollagePage } from "@/components/pages/PolaroidCollagePage";
import { AboutUsPage } from "@/components/pages/AboutUsPage";
import { BackCoverPage } from "@/components/pages/BackCoverPage";
import { DraggableStickersLayer } from "@/components/ui/DraggableStickersLayer";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  BookOpen,
  Camera,
  Type,
  Sparkles,
  Share2,
  Heart,
} from "lucide-react";

// Dimensions tuned for laptop & desktop immersion
export const PAGE_WIDTH = 550;
export const PAGE_HEIGHT = 760;

interface PageFlipMagazineProps {
  onOpenImage?: () => void;
  onOpenText?: () => void;
  onOpenStickers?: () => void;
  onOpenShare?: () => void;
  readOnly?: boolean;
}

export const PageFlipMagazine: React.FC<PageFlipMagazineProps> = ({
  onOpenImage,
  onOpenText,
  onOpenStickers,
  onOpenShare,
  readOnly: propReadOnly,
}) => {
  const {
    isReadOnly: storeReadOnly,
    magazine,
    currentPage,
    setCurrentPage,
    addPlacedImage,
    openPageHeadersEditor,
    updateMemoryPage,
    updatePolaroidItem,
    updateAboutUs,
  } = useMagazineStore();

  const isReadOnly = propReadOnly ?? storeReadOnly;
  const isReadOnlyRef = useRef(isReadOnly);
  useEffect(() => {
    isReadOnlyRef.current = isReadOnly;
  }, [isReadOnly]);

  const containerRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const isInternalFlipRef = useRef<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isBookReady, setIsBookReady] = useState<boolean>(false);

  // Hidden universal file picker for direct 1-tap template photo uploads
  const universalFileInputRef = useRef<HTMLInputElement>(null);
  const targetPhotoSlotRef = useRef<string | null>(null);

  const applyPhotoUrlToSlot = useCallback(
    (slot: string, url: string) => {
      if (isReadOnlyRef.current) return;
      if (slot === "memory-1") {
        updateMemoryPage({ featuredPhotoUrl: url });
      } else if (slot === "memory-2") {
        updateMemoryPage({ secondPhotoUrl: url });
      } else if (slot.startsWith("polaroid-")) {
        const pIdx = parseInt(slot.replace("polaroid-", ""), 10);
        if (!isNaN(pIdx)) {
          updatePolaroidItem(pIdx, { imageUrl: url });
        }
      } else if (slot === "aboutus-main") {
        updateAboutUs({ mainImageUrl: url });
      }
    },
    [updateMemoryPage, updatePolaroidItem, updateAboutUs]
  );

  const triggerPhotoUpload = useCallback((slot: string) => {
    if (isReadOnlyRef.current) return;
    targetPhotoSlotRef.current = slot;
    if (universalFileInputRef.current) {
      universalFileInputRef.current.value = "";
      universalFileInputRef.current.click();
    }
  }, []);

  const handleUniversalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnlyRef.current) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (url && targetPhotoSlotRef.current) {
        applyPhotoUrlToSlot(targetPhotoSlotRef.current, url);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = "";
  };

  // Responsive scale factor for laptop vs mobile
  const [scale, setScale] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Recalculate scale on resize or page change to guarantee zero overflow
  const calculateScale = useCallback(() => {
    if (typeof window === "undefined") return;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const mobile = winW < 768;
    setIsMobile(mobile);

    const bookSpreadW = PAGE_WIDTH * 2; // 1100px
    const bookSpreadH = PAGE_HEIGHT;    // 760px

    if (mobile) {
      // Mobile screen fit: scale to comfortably fit screen width
      const availW = Math.max(300, winW - 20);
      const availH = Math.max(350, winH - 220);
      const sW = availW / bookSpreadW;
      const sH = availH / bookSpreadH;
      setScale(Math.max(0.3, Math.min(sW, sH, 0.48)));
    } else {
      // Laptop / Desktop: make book larger and fill available space comfortably
      const availW = Math.max(800, winW - 140);
      const availH = Math.max(550, winH - 190);
      const sW = availW / bookSpreadW;
      const sH = availH / bookSpreadH;
      const fitScale = Math.min(sW, sH);
      // Scale generously on large screens (up to 1.15) or fit cleanly on compact laptops (0.75+)
      setScale(Math.max(0.75, Math.min(1.15, fitScale)));
    }
  }, []);

  useEffect(() => {
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [calculateScale]);

  // Flip handlers
  const handlePrevPage = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev();
    }
  }, []);

  const handleNextPage = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext();
    }
  }, []);

  // Keyboard Arrow Key Navigation (Only arrow keys turn the pages, not page clicks/taps)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Do not turn pages when typing inside text inputs, textareas, or contentEditable
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevPage, handleNextPage]);

  // Initialize PageFlip instance with isolated host architecture
  useEffect(() => {
    if (!containerRef.current || !templateRef.current) return;

    let pageFlipInstance: PageFlip | null = null;

    try {
      containerRef.current.innerHTML = "";
      const host = document.createElement("div");
      containerRef.current.appendChild(host);

      const pageElements = Array.from(templateRef.current.children).map(
        (el) => el.cloneNode(true) as HTMLElement
      );

      pageFlipInstance = new PageFlip(host, {
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        size: "fixed" as unknown as SizeType,
        minWidth: 320,
        maxWidth: 700,
        minHeight: 460,
        maxHeight: 900,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        showCover: true,
        usePortrait: false,
        startPage: currentPage || 0,
        flippingTime: 650,
        // CRUCIAL: Disable mouse/touch drag and click-flipping on pages
        // Pages only turn via arrow keys or navigation buttons!
        useMouseEvents: false,
        showPageCorners: false,
        disableFlipByClick: true,
        autoSize: false,
        clickEventForward: true,
      });

      pageFlipInstance.loadFromHTML(pageElements);
      pageFlipRef.current = pageFlipInstance;
      setIsBookReady(true);

      pageFlipInstance.on("flip", (e: unknown) => {
        const eventData = e as { data: number };
        if (typeof eventData?.data === "number") {
          isInternalFlipRef.current = true;
          setActivePageIndex(eventData.data);
          setCurrentPage(eventData.data);
          setTimeout(() => {
            isInternalFlipRef.current = false;
          }, 300);
        }
      });
    } catch (err) {
      console.error("Error setting up PageFlip:", err);
    }

    return () => {
      if (pageFlipInstance) {
        try {
          pageFlipInstance.destroy();
        } catch {
          // ignore
        }
      }
      pageFlipRef.current = null;
      setIsBookReady(false);
    };
  }, []);

  // Sync external page navigation (e.g. from editor sidebar)
  useEffect(() => {
    if (isInternalFlipRef.current) return;

    if (pageFlipRef.current && isBookReady) {
      const current = pageFlipRef.current.getCurrentPageIndex();
      if (current !== currentPage) {
        try {
          pageFlipRef.current.flip(currentPage);
          setActivePageIndex(currentPage);
        } catch (err) {
          console.warn("Could not flip to page:", currentPage, err);
        }
      }
    }
  }, [currentPage, isBookReady]);

  const isInitialMountRef = useRef(true);

  // Sync live template edits into the PageFlip instance
  useEffect(() => {
    if (!pageFlipRef.current || !isBookReady || !templateRef.current) return;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      try {
        if (pageFlipRef.current && templateRef.current) {
          const updatedPages = Array.from(templateRef.current.children).map(
            (el) => el.cloneNode(true) as HTMLElement
          );
          pageFlipRef.current.updateFromHtml(updatedPages);
        }
      } catch (err) {
        console.warn("Could not live-update page-flip:", err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [
    magazine.frontCover,
    magazine.memoryPage,
    magazine.polaroidCollage,
    magazine.aboutUs,
    magazine.backCover,
    isBookReady,
  ]);

  // Delegated direct tap, click, and drag-and-drop listener on containerRef for template photos and texts
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      if (isReadOnly || isReadOnlyRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const photoSlot = target.closest("[data-photo-action]") as HTMLElement | null;
      if (photoSlot) {
        const action = photoSlot.getAttribute("data-photo-action");
        if (action) {
          e.preventDefault();
          e.stopPropagation();
          triggerPhotoUpload(action);
          return;
        }
      }

      const textSlot = target.closest("[data-text-action]") as HTMLElement | null;
      if (textSlot) {
        const pageIdx = parseInt(textSlot.getAttribute("data-text-action") || "1", 10);
        e.preventDefault();
        e.stopPropagation();
        openPageHeadersEditor(pageIdx);
        return;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      if (isReadOnly || isReadOnlyRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-photo-action]")) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      }
    };

    const handleDrop = (e: DragEvent) => {
      if (isReadOnly || isReadOnlyRef.current) return;
      const target = e.target as HTMLElement | null;
      const photoSlot = target?.closest("[data-photo-action]") as HTMLElement | null;
      if (photoSlot) {
        e.preventDefault();
        e.stopPropagation();
        const action = photoSlot.getAttribute("data-photo-action");
        const file = e.dataTransfer?.files?.[0];
        if (action && file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const url = ev.target?.result as string;
            if (url) {
              applyPhotoUrlToSlot(action, url);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    container.addEventListener("click", handleClick);
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("dragover", handleDragOver);
      container.removeEventListener("drop", handleDrop);
    };
  }, [triggerPhotoUpload, applyPhotoUrlToSlot, openPageHeadersEditor, isReadOnly]);

  // Flip to first inside spread (Page 1: Memory & Page 2: Photobooth Strip)
  const handleOpenBook = () => {
    setCurrentPage(1);
  };

  const isClosedCover = activePageIndex === 0;
  const isBackCover = activePageIndex >= 5;
  const halfWidth = PAGE_WIDTH / 2;
  const spreadWidth = PAGE_WIDTH * 2;

  const hasItemsOnPage4 =
    (magazine.placedStickers || []).some((s) => s.pageIndex === 4) ||
    (magazine.placedImages || []).some((img) => img.pageIndex === 4) ||
    (magazine.placedTexts || []).some((txt) => txt.pageIndex === 4);

  return (
    <div className="flex flex-col items-center justify-center w-full select-none">
      {/* Outer Scaled Book Viewport */}
      <div
        className="w-full flex flex-col items-center justify-center overflow-visible"
        style={{
          height: `${PAGE_HEIGHT * scale}px`,
        }}
      >
        {/* Book Container with CSS scale */}
        <div
          className="relative flex items-center justify-center transition-transform duration-300 origin-center shrink-0"
          style={{
            width: `${spreadWidth}px`,
            height: `${PAGE_HEIGHT}px`,
            transform: `scale(${scale})`,
          }}
        >
          {/* Previous / Next Navigation Arrows */}
          {!isClosedCover && (
            <button
              type="button"
              onClick={handlePrevPage}
              className="absolute -left-16 sm:-left-20 md:-left-24 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-[#fdfbf7]/95 hover:bg-white text-[#581620] border border-[#d4af37]/50 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Previous Page (or Left Arrow Key ←)"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}

          {!isBackCover && (
            <button
              type="button"
              onClick={handleNextPage}
              className="absolute -right-16 sm:-right-20 md:-right-24 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-[#fdfbf7]/95 hover:bg-white text-[#581620] border border-[#d4af37]/50 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Next Page (or Right Arrow Key →)"
              aria-label="Next Page"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}

          {/* Active PageFlip Mount Target */}
          <div
            ref={containerRef}
            className={`transition-transform duration-500 ease-in-out ${
              isReadOnly ? "read-only-showcase" : ""
            }`}
            style={{
              minHeight: `${PAGE_HEIGHT}px`,
              transform: isClosedCover
                ? `translateX(-${halfWidth}px)`
                : isBackCover
                ? `translateX(${halfWidth}px)`
                : "translateX(0px)",
            }}
          />

          {/* Interactive Draggable Stickers Layer for Visible Pages */}
          {isBookReady && (
            <div
              className="absolute top-0 pointer-events-none z-30 transition-transform duration-500 ease-in-out"
              style={{
                width: isClosedCover || isBackCover ? `${PAGE_WIDTH}px` : `${spreadWidth}px`,
                height: `${PAGE_HEIGHT}px`,
                transform: isClosedCover
                  ? `translateX(-${halfWidth}px)`
                  : isBackCover
                  ? `translateX(${halfWidth}px)`
                  : "translateX(0px)",
              }}
            >
              {isClosedCover && (
                <div
                  className="relative overflow-hidden"
                  style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
                >
                  <DraggableStickersLayer pageIndex={0} readOnly={isReadOnly} />
                  {!isReadOnly && (
                    <div className="absolute top-4 left-6 z-40">
                      <button
                        type="button"
                        onClick={() => openPageHeadersEditor(0)}
                        className="pointer-events-auto px-2.5 py-1 rounded-full bg-[#1f060a]/80 hover:bg-[#340c14] text-[#f5d574] text-[11px] font-serif-dearly border border-[#d4af37]/40 shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer opacity-75 hover:opacity-100 hover:scale-105"
                        title="Edit Cover Title & Subtitle"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                        <span>Edit Cover Title</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              {!isClosedCover && !isBackCover && (
                <div
                  className="relative overflow-hidden pointer-events-none"
                  style={{ width: `${spreadWidth}px`, height: `${PAGE_HEIGHT}px` }}
                >
                  {/* Single Unified Spread Overlay across both pages without spine boundary clipping */}
                  <DraggableStickersLayer
                    spreadMode={true}
                    leftPageIndex={activePageIndex <= 2 ? 1 : 3}
                    rightPageIndex={activePageIndex <= 2 ? 2 : 4}
                    readOnly={isReadOnly}
                  />

                  {!isReadOnly && (
                    <>
                      {/* Left Page Edit Header Button */}
                      <div className="absolute top-3 left-12 z-40">
                        <button
                          type="button"
                          onClick={() => openPageHeadersEditor(activePageIndex <= 2 ? 1 : 3)}
                          className="pointer-events-auto px-2.5 py-1 rounded-full bg-[#fdfbf6]/90 hover:bg-[#fff] text-[#581620] text-[11px] font-serif-dearly border border-[#d4af37]/50 shadow-sm backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer opacity-75 hover:opacity-100 hover:scale-105"
                          title={activePageIndex <= 2 ? "Edit Memory Page Title & Text" : "Edit Our Story Title & Text"}
                        >
                          <Pencil className="w-2.5 h-2.5 text-[#9e2a2b]" />
                          <span>{activePageIndex <= 2 ? "Edit Headline & Story" : "Edit Story Title & Note"}</span>
                        </button>
                      </div>

                      {/* Right Page Edit Header Button */}
                      {activePageIndex <= 2 && (
                        <div className="absolute top-3 right-12 z-40">
                          <button
                            type="button"
                            onClick={() => openPageHeadersEditor(2)}
                            className="pointer-events-auto px-2.5 py-1 rounded-full bg-[#fdfbf6]/90 hover:bg-[#fff] text-[#581620] text-[11px] font-serif-dearly border border-[#d4af37]/50 shadow-sm backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer opacity-75 hover:opacity-100 hover:scale-105"
                            title="Edit Photobooth Strip Title & Note"
                          >
                            <Pencil className="w-2.5 h-2.5 text-[#9e2a2b]" />
                            <span>Edit Strip Title</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              {isBackCover && (
                <div
                  className="relative overflow-hidden"
                  style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
                >
                  <DraggableStickersLayer pageIndex={5} readOnly={isReadOnly} />
                  {!isReadOnly && (
                    <div className="absolute top-4 right-8 z-40">
                      <button
                        type="button"
                        onClick={() => openPageHeadersEditor(5)}
                        className="pointer-events-auto px-2.5 py-1 rounded-full bg-[#1f060a]/80 hover:bg-[#340c14] text-[#f5d574] text-[11px] font-serif-dearly border border-[#d4af37]/40 shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer opacity-75 hover:opacity-100 hover:scale-105"
                        title="Edit Closing Note & Signature"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                        <span>Edit Closing Note</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dedicated Page Navigation Bar (Only on small screens) */}
      <div className="flex md:hidden items-center justify-center gap-3 mt-3 mb-1 z-30">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={isClosedCover}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#fdfbf7] text-[#581620] border border-[#d4af37]/50 text-xs font-serif-dearly font-medium shadow-sm disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className="text-[11px] font-mono font-medium text-[#735e51] px-3 py-1 rounded-full bg-[#ebdccd]/90 border border-[#dfd0be]">
          {activePageIndex === 0
            ? "Front Cover"
            : activePageIndex >= 5
            ? "Back Cover"
            : `Pages ${activePageIndex <= 2 ? "01 - 02" : "03 - 04"} / 05`}
        </span>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={isBackCover}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#fdfbf7] text-[#581620] border border-[#d4af37]/50 text-xs font-serif-dearly font-medium shadow-sm disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden Master Templates (Always rendered and synced by React) */}
      <div ref={templateRef} style={{ display: "none" }} aria-hidden="true">
        {/* Page 0: Front Cover (Hard density - Right side when closed) */}
        <div
          className="book-page relative overflow-hidden rounded-r-2xl shadow-2xl"
          data-density="hard"
          style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
        >
          {/* Authentic High-Res Cover Background from User */}
          <Image
            src="/pages/front.png"
            alt="Front Cover"
            fill
            priority
            unoptimized
            className="object-cover pointer-events-none select-none"
          />

          <div className="relative z-10 w-full h-full">
            <FrontCoverPage
              data={magazine.frontCover}
              onEditClick={isReadOnly ? undefined : () => openPageHeadersEditor(0)}
            />
          </div>
        </div>

        {/* Page 1: Inside Left - Memory Page (Soft density) */}
        <div
          className="book-page relative overflow-hidden rounded-l-md shadow-md"
          data-density="soft"
          style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
        >
          {/* Authentic High-Res Inside Left Page Background from User */}
          <Image
            src="/pages/left.png"
            alt="Inside Left Page"
            fill
            priority
            unoptimized
            className="object-cover pointer-events-none select-none"
          />

          <div className="relative z-10 w-full h-full">
            <MemoryPage
              data={magazine.memoryPage}
              onEditClick={isReadOnly ? undefined : () => openPageHeadersEditor(1)}
            />
          </div>
        </div>

        {/* Page 2: Inside Right - Photobooth Strip (Soft density) */}
        <div
          className="book-page relative overflow-hidden rounded-r-md shadow-md"
          data-density="soft"
          style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
        >
          {/* Authentic High-Res Inside Right Page Background from User */}
          <Image
            src="/pages/right.png"
            alt="Inside Right Page"
            fill
            priority
            unoptimized
            className="object-cover pointer-events-none select-none"
          />

          <div className="relative z-10 w-full h-full">
            <PolaroidCollagePage
              data={magazine.polaroidCollage}
              onEditClick={isReadOnly ? undefined : () => openPageHeadersEditor(2)}
            />
          </div>
        </div>

        {/* Page 3: Inside Left - Our Story (Soft density) */}
        <div
          className="book-page relative overflow-hidden rounded-l-md shadow-md"
          data-density="soft"
          style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
        >
          <Image
            src="/pages/left.png"
            alt="Inside Left Page"
            fill
            priority
            unoptimized
            className="object-cover pointer-events-none select-none"
          />

          <div className="relative z-10 w-full h-full">
            <AboutUsPage
              data={magazine.aboutUs}
              onEditClick={isReadOnly ? undefined : () => openPageHeadersEditor(3)}
            />
          </div>
        </div>

        {/* Page 4: Inside Right - Keepsake Page (Soft density) */}
        <div
          className="book-page relative overflow-hidden rounded-r-md shadow-md"
          data-density="soft"
          style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
        >
          {/* Authentic High-Res Inside Right Page Background from User */}
          <Image
            src="/pages/right.png"
            alt="Blank inside page"
            fill
            priority
            unoptimized
            className="object-cover pointer-events-none select-none"
          />

          <div
            onDragOver={(e) => {
              if (isReadOnly) return;
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              if (isReadOnly) return;
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (ev.target?.result) {
                    addPlacedImage({
                      pageIndex: 4,
                      src: ev.target.result as string,
                      x: 50,
                      y: 50,
                      rotation: Math.round(Math.random() * 12 - 6),
                    });
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
            className="relative z-10 w-full h-full pl-18 sm:pl-20 pr-12 sm:pr-14 pt-12 sm:pt-14 pb-12 sm:pb-14 flex flex-col justify-between overflow-hidden text-[#2c221e]"
          >
            {/* Page number */}
            <div className="flex justify-end pr-2 opacity-50">
              <span className="text-[10px] font-mono tracking-widest text-[#8c7769]">
                pg. 04
              </span>
            </div>

            {hasItemsOnPage4 ? (
              <div className="flex-1" />
            ) : (
              <div className="my-auto text-center px-4">
                <p className="font-handwriting text-2xl sm:text-3xl text-[#8c7769]/30 select-none">
                  A quiet space for unwritten words...
                </p>
                <p className="text-[11px] font-serif-dearly text-[#8c7769]/40 mt-1 select-none">
                  {isReadOnly
                    ? "A keepsake page for cherished memories"
                    : "Click Image, Text, or Stickers below to create your page"}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-[#8c7769] font-serif-dearly mt-auto">
              <span className="italic font-handwriting text-sm text-[#9e2a2b]/70 flex items-center gap-1">
                To be continued <Heart className="w-3 h-3 fill-current inline" />
              </span>
              <span className="font-mono opacity-40">Dearly</span>
            </div>
          </div>
        </div>

        {/* Page 5: Back Cover Outside with The Final Note (Hard density) */}
        <div
          className="book-page relative overflow-hidden rounded-l-2xl shadow-2xl"
          data-density="hard"
          style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
        >
          {/* Authentic High-Res Back Cover Background from User */}
          <Image
            src="/pages/back.png"
            alt="Back Cover"
            fill
            priority
            unoptimized
            className="object-cover pointer-events-none select-none"
          />

          <div className="relative z-10 w-full h-full">
            <BackCoverPage
              data={magazine.backCover}
              onEditClick={isReadOnly ? undefined : () => openPageHeadersEditor(5)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Minimal UI Buttons (Matching the prototype screenshots) */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4 z-20 flex-wrap px-2">
        {isReadOnly ? (
          /* READ-ONLY SHOWCASE CONTROLS */
          isClosedCover ? (
            <button
              type="button"
              onClick={handleOpenBook}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-sm font-serif-dearly tracking-wide border border-[#d4af37]/60 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium"
            >
              <BookOpen className="w-4 h-4 text-[#f5d574]" />
              <span>Read Keepsake</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap justify-center">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={isClosedCover}
                className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#fdfbf7] hover:bg-[#fff] text-[#581620] text-xs sm:text-sm font-serif-dearly tracking-wide border border-[#b8a38b] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium min-h-[38px] disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={isBackCover}
                className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#fdfbf7] hover:bg-[#fff] text-[#581620] text-xs sm:text-sm font-serif-dearly tracking-wide border border-[#b8a38b] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium min-h-[38px] disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {onOpenShare && (
                <button
                  type="button"
                  onClick={onOpenShare}
                  className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs sm:text-sm font-serif-dearly tracking-wide border border-[#d4af37]/60 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium min-h-[38px]"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#f5d574]" />
                  <span>Share Keepsake</span>
                </button>
              )}
            </div>
          )
        ) : isClosedCover ? (
          /* EDIT MODE: Closed Cover [ Open Magazine ] button */
          <button
            type="button"
            onClick={handleOpenBook}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#e8dac7]/90 hover:bg-[#efe4d5] text-[#2c221c] text-sm font-serif-dearly tracking-wide border border-[#b8a38b] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium"
          >
            <BookOpen className="w-4 h-4 text-[#9e2a2b]" />
            <span>Open Magazine</span>
          </button>
        ) : (
          /* EDIT MODE: Four minimal buttons [ Image ] [ Text ] [ Stickers ] [ Share ] */
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap justify-center">
            <button
              type="button"
              onClick={onOpenImage}
              className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#e8dac7]/90 hover:bg-[#efe4d5] text-[#2c221c] text-xs sm:text-sm font-sans tracking-wide border border-[#b8a38b] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium min-h-[38px]"
            >
              <Camera className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={onOpenText}
              className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#e8dac7]/90 hover:bg-[#efe4d5] text-[#2c221c] text-xs sm:text-sm font-sans tracking-wide border border-[#b8a38b] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium min-h-[38px]"
            >
              <Type className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={onOpenStickers}
              className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#e8dac7]/90 hover:bg-[#efe4d5] text-[#2c221c] text-xs sm:text-sm font-sans tracking-wide border border-[#b8a38b] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium min-h-[38px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <span>Stickers</span>
            </button>

            <button
              type="button"
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs sm:text-sm font-sans tracking-wide border border-[#d4af37]/60 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium min-h-[38px]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#f5d574]" />
              <span>Share</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden Universal File Input for 1-Tap Template Photo Uploads */}
      <input
        ref={universalFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUniversalFileChange}
      />
    </div>
  );
};

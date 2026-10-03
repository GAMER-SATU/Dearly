"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMagazineStore } from "@/store/useMagazineStore";
import { PlacedSticker, PlacedImage, PlacedText } from "@/types/magazine";
import { WashiTape } from "@/components/ui/WashiTape";
import { X, RotateCw, Plus, Minus, Pencil, Palette, ArrowLeftRight } from "lucide-react";

interface DraggableStickersLayerProps {
  pageIndex?: number;
  spreadMode?: boolean;
  leftPageIndex?: number;
  rightPageIndex?: number;
  readOnly?: boolean;
}

export const DraggableStickersLayer: React.FC<DraggableStickersLayerProps> = ({
  pageIndex = 0,
  spreadMode = false,
  leftPageIndex = 1,
  rightPageIndex = 2,
  readOnly: propReadOnly,
}) => {
  const {
    isReadOnly: storeReadOnly,
    magazine,
    updatePlacedSticker,
    removePlacedSticker,
    updatePlacedImage,
    removePlacedImage,
    updatePlacedText,
    removePlacedText,
    openTextEditor,
  } = useMagazineStore();

  const readOnly = propReadOnly ?? storeReadOnly;

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging state refs with pointer offsets so element doesn't jump to center on click
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartPosRef = useRef<{ clientX: number; clientY: number }>({ clientX: 0, clientY: 0 });
  const dragTargetRef = useRef<{
    id: string;
    type: "sticker" | "image" | "text";
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // Resizing state refs
  const isResizingRef = useRef(false);
  const resizeTargetRef = useRef<{
    id: string;
    type: "sticker" | "image" | "text";
    startX: number;
    startY: number;
    startScale: number;
  } | null>(null);

  const isReadOnlyRef = useRef(readOnly);
  useEffect(() => {
    isReadOnlyRef.current = readOnly;
    if (readOnly) {
      setActiveItemId(null);
      isDraggingRef.current = false;
      isResizingRef.current = false;
    }
  }, [readOnly]);

  const pageStickers = (magazine.placedStickers || []).filter((s) =>
    spreadMode
      ? s.pageIndex === leftPageIndex || s.pageIndex === rightPageIndex
      : s.pageIndex === pageIndex
  );
  const pageImages = (magazine.placedImages || []).filter((img) =>
    spreadMode
      ? img.pageIndex === leftPageIndex || img.pageIndex === rightPageIndex
      : img.pageIndex === pageIndex
  );
  const pageTexts = (magazine.placedTexts || []).filter((txt) =>
    spreadMode
      ? txt.pageIndex === leftPageIndex || txt.pageIndex === rightPageIndex
      : txt.pageIndex === pageIndex
  );

  const getItemSpreadX = (item: { x: number; pageIndex: number }) => {
    if (spreadMode) {
      return item.pageIndex === rightPageIndex ? 50 + item.x / 2 : item.x / 2;
    }
    return item.x;
  };

  // Global pointer event listener for smooth dragging, drag-resizing, and deselect on outside click
  useEffect(() => {
    if (readOnly || isReadOnlyRef.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      // 1. Drag Resizing
      if (isResizingRef.current && resizeTargetRef.current) {
        const { id, type, startX, startY, startScale } = resizeTargetRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const delta = (deltaX + deltaY) / 2;
        const scaleChange = delta / 100;
        const newScale = Math.max(0.3, Math.min(4.0, Math.round((startScale + scaleChange) * 100) / 100));

        if (type === "sticker") {
          updatePlacedSticker(id, { scale: newScale });
        } else if (type === "image") {
          updatePlacedImage(id, { scale: newScale });
        } else if (type === "text") {
          updatePlacedText(id, { scale: newScale });
        }
        return;
      }

      // 2. Drag Positioning (offset-aware to prevent jumping)
      if (!isDraggingRef.current || !dragTargetRef.current || !containerRef.current)
        return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      // Only engage live coordinate updates if pointer actually moved beyond 4px (distinguishes tap/click from drag)
      const dist = Math.hypot(
        clientX - dragStartPosRef.current.clientX,
        clientY - dragStartPosRef.current.clientY
      );
      if (dist < 4) return;
      hasDraggedRef.current = true;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const pointerXPercent = ((clientX - rect.left) / rect.width) * 100;
      const pointerYPercent = ((clientY - rect.top) / rect.height) * 100;

      const targetX = pointerXPercent - dragTargetRef.current.offsetX;
      const targetY = pointerYPercent - dragTargetRef.current.offsetY;

      if (isNaN(targetX) || isNaN(targetY)) return;

      const { id, type } = dragTargetRef.current;

      if (spreadMode) {
        // Continuous spread dragging across 1st and 2nd page without spine barrier
        const clampedSpreadX = Math.max(2, Math.min(98, targetX));
        const clampedSpreadY = Math.max(4, Math.min(96, targetY));

        let newPageIndex = leftPageIndex;
        let localX = Math.round(clampedSpreadX * 2 * 10) / 10;

        if (clampedSpreadX >= 50) {
          newPageIndex = rightPageIndex;
          localX = Math.round((clampedSpreadX - 50) * 2 * 10) / 10;
        }

        localX = Math.max(4, Math.min(96, localX));
        const localY = Math.round(clampedSpreadY * 10) / 10;

        if (type === "sticker") {
          updatePlacedSticker(id, { pageIndex: newPageIndex, x: localX, y: localY });
        } else if (type === "image") {
          updatePlacedImage(id, { pageIndex: newPageIndex, x: localX, y: localY });
        } else if (type === "text") {
          updatePlacedText(id, { pageIndex: newPageIndex, x: localX, y: localY });
        }
      } else {
        const xPercent = Math.max(4, Math.min(96, targetX));
        const yPercent = Math.max(4, Math.min(96, targetY));

        const roundedX = Math.round(xPercent * 10) / 10;
        const roundedY = Math.round(yPercent * 10) / 10;

        if (type === "sticker") {
          updatePlacedSticker(id, { x: roundedX, y: roundedY });
        } else if (type === "image") {
          updatePlacedImage(id, { x: roundedX, y: roundedY });
        } else if (type === "text") {
          updatePlacedText(id, { x: roundedX, y: roundedY });
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      dragTargetRef.current = null;
      isResizingRef.current = false;
      resizeTargetRef.current = null;
    };

    const handleWindowPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-placed-item]")) {
        setActiveItemId(null);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerdown", handleWindowPointerDown);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerdown", handleWindowPointerDown);
    };
  }, [updatePlacedSticker, updatePlacedImage, updatePlacedText, spreadMode, leftPageIndex, rightPageIndex, readOnly]);

  const handleStartDrag = (
    e: React.PointerEvent<HTMLDivElement>,
    id: string,
    type: "sticker" | "image" | "text",
    curX: number,
    curY: number,
    itemPageIndex?: number
  ) => {
    if (readOnly || isReadOnlyRef.current) return;
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartPosRef.current = { clientX: e.clientX, clientY: e.clientY };

    const safeCurX = typeof curX === "number" && !isNaN(curX) ? curX : 50;
    const safeCurY = typeof curY === "number" && !isNaN(curY) ? curY : 50;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const pointerX = ((e.clientX - rect.left) / rect.width) * 100;
        const pointerY = ((e.clientY - rect.top) / rect.height) * 100;

        const effectiveX =
          spreadMode && itemPageIndex === rightPageIndex
            ? 50 + safeCurX / 2
            : spreadMode
            ? safeCurX / 2
            : safeCurX;

        dragTargetRef.current = {
          id,
          type,
          offsetX: pointerX - effectiveX,
          offsetY: pointerY - safeCurY,
        };
        return;
      }
    }
    dragTargetRef.current = { id, type, offsetX: 0, offsetY: 0 };
  };

  const handleStartResize = (
    e: React.PointerEvent,
    id: string,
    currentScale: number,
    type: "sticker" | "image" | "text"
  ) => {
    if (readOnly || isReadOnlyRef.current) return;
    e.stopPropagation();
    setActiveItemId(id);
    isResizingRef.current = true;
    resizeTargetRef.current = {
      id,
      type,
      startX: e.clientX,
      startY: e.clientY,
      startScale: currentScale || 1,
    };
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden"
      aria-label="Freeform Canvas Layer"
    >
      {/* 1. Placed Stickers */}
      {pageStickers.map((sticker) => {
        const isActive = activeItemId === sticker.id;
        const rot = sticker.rotation || 0;
        const sc = sticker.scale || 1;

        return (
          <div
            key={sticker.id}
            data-placed-item={readOnly ? undefined : sticker.id}
            onPointerDown={
              readOnly
                ? undefined
                : (e) => handleStartDrag(e, sticker.id, "sticker", sticker.x, sticker.y, sticker.pageIndex)
            }
            onClick={
              readOnly
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    setActiveItemId(sticker.id);
                  }
            }
            className={`absolute ${
              readOnly
                ? "pointer-events-none select-none"
                : "pointer-events-auto cursor-grab active:cursor-grabbing group transition-shadow"
            } ${
              isActive && !readOnly
                ? "ring-1.5 ring-[#9e2a2b]/80 ring-dashed rounded-xs shadow-md"
                : !readOnly
                ? "hover:ring-1 hover:ring-[#d4af37]/80 hover:ring-dashed rounded-xs"
                : ""
            }`}
            style={{
              left: `${getItemSpreadX(sticker)}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`,
              transformOrigin: "center center",
              touchAction: "none",
            }}
            title={readOnly ? undefined : "Drag to move, click handles to scale, rotate or delete"}
          >
            <div className={`relative w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md transition-transform ${readOnly ? "" : "group-hover:scale-105"}`}>
              <Image
                src={sticker.src}
                alt={sticker.name || "Sticker"}
                fill
                unoptimized
                draggable={false}
                className="object-contain pointer-events-none"
              />
            </div>

            {/* Quick Toolbar & Resize Handle (Only when NOT readOnly) */}
            {!readOnly && (
              <>
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`absolute ${
                    sticker.y < 16 ? "top-full mt-2" : "-top-10"
                  } left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all z-40 bg-[#fdfbf7]/98 backdrop-blur-xs rounded-full px-2 py-1 shadow-xl border border-[#dfd2c0] ${
                    isActive
                      ? "opacity-100 pointer-events-auto scale-100"
                      : "opacity-0 pointer-events-none scale-95"
                  }`}
                >
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.max(0.3, Math.round((sc - 0.15) * 100) / 100);
                      updatePlacedSticker(sticker.id, { scale: newScale });
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Scale Down (-)"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.min(4.0, Math.round((sc + 0.15) * 100) / 100);
                      updatePlacedSticker(sticker.id, { scale: newScale });
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Scale Up (+)"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePlacedSticker(sticker.id, {
                        rotation: ((sticker.rotation || 0) + 15) % 360,
                      });
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Rotate 15°"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlacedSticker(sticker.id);
                      setActiveItemId(null);
                    }}
                    className="w-5 h-5 rounded-full bg-[#faebea] hover:bg-[#e63946] text-[#9e2a2b] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                    title="Remove sticker"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Corner Resize Drag Handle */}
                <div
                  onPointerDown={(e) => handleStartResize(e, sticker.id, sc, "sticker")}
                  className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-[#9e2a2b] shadow-md flex items-center justify-center transition-all cursor-se-resize z-40 hover:scale-125 ${
                    isActive
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  title="Drag corner to resize sticker"
                >
                  <div className="w-1 h-1 bg-[#9e2a2b] rounded-full" />
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* 2. Placed Images / Polaroids */}
      {pageImages.map((img) => {
        const isActive = activeItemId === img.id;
        const rot = img.rotation || 0;
        const sc = img.scale || 1;

        return (
          <div
            key={img.id}
            data-placed-item={readOnly ? undefined : img.id}
            onPointerDown={
              readOnly
                ? undefined
                : (e) => handleStartDrag(e, img.id, "image", img.x, img.y, img.pageIndex)
            }
            onClick={
              readOnly
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    setActiveItemId(img.id);
                  }
            }
            className={`absolute ${
              readOnly
                ? "pointer-events-none select-none"
                : "pointer-events-auto cursor-grab active:cursor-grabbing group transition-shadow"
            } ${
              isActive && !readOnly
                ? "ring-2 ring-[#9e2a2b] shadow-xl"
                : !readOnly
                ? "hover:ring-1 hover:ring-[#d4af37] shadow-md"
                : "shadow-md"
            }`}
            style={{
              left: `${getItemSpreadX(img)}%`,
              top: `${img.y}%`,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`,
              transformOrigin: "center center",
              touchAction: "none",
            }}
            title={readOnly ? undefined : "Drag photo anywhere, scale, rotate or delete"}
          >
            {/* Washi Tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <WashiTape rotate="-rotate-2" className="h-2 w-12" />
            </div>

            {/* Polaroid Paper Frame */}
            <div className="polaroid-frame w-[140px] p-2 pb-3 bg-white rounded-[2px] border border-stone-200">
              <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden rounded-[1px]">
                <Image
                  src={img.src}
                  alt={img.caption || "Scrapbook photo"}
                  fill
                  unoptimized
                  draggable={false}
                  className="object-cover pointer-events-none"
                  sizes="140px"
                />
              </div>

              {img.caption && (
                <p className="font-handwriting text-xs text-center text-[#3e2e26] mt-1.5 px-0.5 truncate leading-tight">
                  {img.caption}
                </p>
              )}
            </div>

            {/* Quick Actions Bar & Resize Handle (Only when NOT readOnly) */}
            {!readOnly && (
              <>
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`absolute ${
                    img.y < 16 ? "top-full mt-2.5" : "-top-11"
                  } left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all z-40 bg-[#fdfbf7]/98 backdrop-blur-xs rounded-full px-2 py-1 shadow-xl border border-[#dfd2c0] ${
                    isActive
                      ? "opacity-100 pointer-events-auto scale-100"
                      : "opacity-0 pointer-events-none scale-95"
                  }`}
                >
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.max(0.3, Math.round((sc - 0.15) * 100) / 100);
                      updatePlacedImage(img.id, { scale: newScale });
                    }}
                    className="w-6 h-6 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Scale Down (-)"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.min(4.0, Math.round((sc + 0.15) * 100) / 100);
                      updatePlacedImage(img.id, { scale: newScale });
                    }}
                    className="w-6 h-6 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Scale Up (+)"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePlacedImage(img.id, {
                        rotation: ((img.rotation || 0) + 15) % 360,
                      });
                    }}
                    className="w-6 h-6 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Rotate 15°"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                  {spreadMode && (
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newPage = img.pageIndex === leftPageIndex ? rightPageIndex : leftPageIndex;
                        updatePlacedImage(img.id, { pageIndex: newPage });
                      }}
                      className="w-6 h-6 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                      title={
                        img.pageIndex === leftPageIndex
                          ? `Send to Page ${rightPageIndex} (Right Page)`
                          : `Send to Page ${leftPageIndex} (Left Page)`
                      }
                    >
                      <ArrowLeftRight className="w-2.5 h-2.5" />
                    </button>
                  )}

                  {/* Distinct Delete Button */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlacedImage(img.id);
                      setActiveItemId(null);
                    }}
                    className="w-6 h-6 rounded-full bg-[#faebea] hover:bg-[#e63946] text-[#9e2a2b] hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs ml-0.5"
                    title="Delete photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Corner Resize Drag Handle */}
                <div
                  onPointerDown={(e) => handleStartResize(e, img.id, sc, "image")}
                  className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-[#9e2a2b] shadow-md flex items-center justify-center transition-all cursor-se-resize z-40 hover:scale-125 ${
                    isActive
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  title="Drag corner to resize photo"
                >
                  <div className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* 3. Placed Text Boxes */}
      {pageTexts.map((txt) => {
        const isActive = activeItemId === txt.id;
        const rot = txt.rotation || 0;
        const sc = txt.scale || 1;
        const fontClass =
          txt.fontStyle === "serif"
            ? "font-serif-dearly italic"
            : txt.fontStyle === "mono"
            ? "font-mono"
            : txt.fontStyle === "sans"
            ? "font-sans"
            : "font-handwriting";

        const sizeClass =
          txt.fontSize === "sm"
            ? "text-xs sm:text-sm leading-snug"
            : txt.fontSize === "lg"
            ? "text-lg sm:text-xl leading-relaxed"
            : txt.fontSize === "xl"
            ? "text-xl sm:text-2xl leading-relaxed font-bold"
            : "text-sm sm:text-base leading-relaxed";

        const isTransparent = txt.cardStyle === "transparent";
        const isTape = txt.cardStyle === "tape";
        const textColor = txt.color || "#2c221e";

        return (
          <div
            key={txt.id}
            data-placed-item={readOnly ? undefined : txt.id}
            onPointerDown={
              readOnly
                ? undefined
                : (e) => handleStartDrag(e, txt.id, "text", txt.x, txt.y, txt.pageIndex)
            }
            onClick={
              readOnly
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    setActiveItemId(txt.id);
                  }
            }
            onDoubleClick={
              readOnly
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    openTextEditor(txt.id);
                  }
            }
            className={`absolute ${
              readOnly
                ? "pointer-events-none select-none"
                : "pointer-events-auto cursor-grab active:cursor-grabbing group transition-all select-none"
            } ${
              isActive && !readOnly
                ? "ring-2 ring-[#9e2a2b] shadow-xl rounded-xs"
                : !readOnly
                ? "hover:ring-1 hover:ring-[#d4af37]/80 hover:ring-dashed rounded-xs"
                : ""
            }`}
            style={{
              left: `${getItemSpreadX(txt)}%`,
              top: `${txt.y}%`,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`,
              transformOrigin: "center center",
              touchAction: "none",
              maxWidth: "360px",
              width: "max-content",
            }}
            title={readOnly ? undefined : "Drag to position. Double-click or click pencil to edit text."}
          >
            {/* Note Body */}
            {isTransparent ? (
              <div className="px-2 py-1">
                <p
                  className={`${fontClass} ${sizeClass} whitespace-pre-wrap`}
                  style={{ color: textColor }}
                >
                  {txt.text}
                </p>
              </div>
            ) : isTape ? (
              <div className="bg-[#faecd9]/90 px-3 py-1.5 border-y border-[#dfcbb7] shadow-2xs rotate-[-0.5deg]">
                <p
                  className={`${fontClass} ${sizeClass} whitespace-pre-wrap font-medium`}
                  style={{ color: textColor }}
                >
                  {txt.text}
                </p>
              </div>
            ) : (
              /* Sticky Note Look - Clean warm paper, NO ruled lines */
              <div className="relative bg-[#fffdf0] px-3.5 py-2.5 rounded-xs border border-[#ebdccb] shadow-[0_3px_10px_rgba(40,25,15,0.12)] rotate-[-0.5deg]">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-[#e8dac7]/90 rounded-xs border border-[#d8c5b0] opacity-80" />
                <p
                  className={`${fontClass} ${sizeClass} whitespace-pre-wrap`}
                  style={{ color: textColor }}
                >
                  {txt.text}
                </p>
              </div>
            )}

            {/* Quick Actions Floating Bar & Resize Handle (Only when NOT readOnly) */}
            {!readOnly && (
              <>
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`absolute ${
                    txt.y < 16 ? "top-full mt-2" : "-top-10"
                  } left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all z-40 bg-[#fdfbf7]/98 backdrop-blur-xs rounded-full px-2 py-1 shadow-xl border border-[#dfd2c0] ${
                    isActive
                      ? "opacity-100 pointer-events-auto scale-100"
                      : "opacity-0 pointer-events-none scale-95"
                  }`}
                >
                  {/* Edit text */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      openTextEditor(txt.id);
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#9e2a2b] text-[#581620] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                    title="Edit text"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                  </button>

                  {/* Toggle Style */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextStyle =
                        txt.cardStyle === "transparent"
                          ? "card"
                          : txt.cardStyle === "card"
                          ? "tape"
                          : "transparent";
                      updatePlacedText(txt.id, { cardStyle: nextStyle });
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Switch Style (Direct / Sticky Note / Tape)"
                  >
                    <Palette className="w-2.5 h-2.5" />
                  </button>

                  {/* Scale Down */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.max(0.3, Math.round((sc - 0.15) * 100) / 100);
                      updatePlacedText(txt.id, { scale: newScale });
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Scale Down (-)"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>

                  {/* Scale Up */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.min(4.0, Math.round((sc + 0.15) * 100) / 100);
                      updatePlacedText(txt.id, { scale: newScale });
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Scale Up (+)"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>

                  {/* Rotate 15° */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePlacedText(txt.id, {
                        rotation: ((txt.rotation || 0) + 15) % 360,
                      });
                    }}
                    className="w-5 h-5 rounded-full bg-[#f8f1e5] hover:bg-[#ebdccb] text-[#581620] flex items-center justify-center cursor-pointer transition-colors"
                    title="Rotate 15°"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlacedText(txt.id);
                      setActiveItemId(null);
                    }}
                    className="w-5 h-5 rounded-full bg-[#faebea] hover:bg-[#e63946] text-[#9e2a2b] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                    title="Delete text"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Corner Resize Drag Handle */}
                <div
                  onPointerDown={(e) => handleStartResize(e, txt.id, sc, "text")}
                  className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-[#9e2a2b] shadow-md flex items-center justify-center transition-all cursor-se-resize z-40 hover:scale-125 ${
                    isActive
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  title="Drag corner to resize text"
                >
                  <div className="w-1.5 h-1.5 bg-[#9e2a2b] rounded-full" />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

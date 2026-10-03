"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMagazineStore } from "@/store/useMagazineStore";
import {
  Type,
  X,
  Plus,
  Check,
  Trash2,
  Sparkles,
  FileText,
  Bookmark,
  StickyNote,
  PenTool,
  BookOpen,
} from "lucide-react";

const INK_COLORS = [
  { name: "Espresso", value: "#2c221e", bg: "bg-[#2c221e]" },
  { name: "Deep Wine", value: "#581620", bg: "bg-[#581620]" },
  { name: "Rose Terracotta", value: "#8c4a4e", bg: "bg-[#8c4a4e]" },
  { name: "Soft Black", value: "#1a1a1a", bg: "bg-[#1a1a1a]" },
  { name: "Vintage Gold", value: "#9a7b38", bg: "bg-[#9a7b38]" },
];

export const TextToolSheet: React.FC = () => {
  const {
    activeToolModal,
    setActiveToolModal,
    currentPage,
    magazine,
    editingTextId,
    textToolTab,
    setTextToolTab,
    addPlacedText,
    updatePlacedText,
    removePlacedText,
    updateFrontCover,
    updateMemoryPage,
    updatePolaroidCollage,
    updateAboutUs,
    updateBackCover,
  } = useMagazineStore();

  const isCover = currentPage === 0;
  const isBack = currentPage >= 5;
  const spreadPages = isCover
    ? [0]
    : isBack
    ? [5]
    : currentPage <= 2
    ? [1, 2]
    : [3, 4];

  // Currently editing item if one was clicked
  const editingItem = editingTextId
    ? (magazine.placedTexts || []).find((t) => t.id === editingTextId)
    : null;

  const [targetPage, setTargetPage] = useState<number>(() => {
    return editingItem
      ? editingItem.pageIndex
      : spreadPages.includes(currentPage)
      ? currentPage
      : spreadPages[0];
  });

  // Direct Freeform Text State
  const [text, setText] = useState("");
  const [fontChoice, setFontChoice] = useState<"handwriting" | "serif" | "mono" | "sans">("handwriting");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [cardStyle, setCardStyle] = useState<"transparent" | "card" | "tape">("transparent");
  const [color, setColor] = useState("#2c221e");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Page Headers & Story State
  const [headerPage, setHeaderPage] = useState<number>(() => currentPage);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cover
  const [coverTitle, setCoverTitle] = useState(magazine.frontCover?.title || "");
  const [coverSubtitle, setCoverSubtitle] = useState(magazine.frontCover?.subtitle || "");
  const [coverDedication, setCoverDedication] = useState(magazine.frontCover?.dedication || "");

  // Page 1 Memory
  const [memoryHeadline, setMemoryHeadline] = useState(magazine.memoryPage?.headline || "");
  const [memoryIntro, setMemoryIntro] = useState(magazine.memoryPage?.introText || "");
  const [memoryBody, setMemoryBody] = useState(magazine.memoryPage?.bodyLetter || "");

  // Page 2 Polaroid
  const [polaroidTitle, setPolaroidTitle] = useState(magazine.polaroidCollage?.title || "");
  const [polaroidNote, setPolaroidNote] = useState(magazine.polaroidCollage?.note || "");

  // Page 3 About Us / Story
  const [aboutTitle, setAboutTitle] = useState(magazine.aboutUs?.title || "");
  const [aboutSubtitle, setAboutSubtitle] = useState(magazine.aboutUs?.subtitle || "");
  const [aboutStory, setAboutStory] = useState(
    magazine.aboutUs?.storyParagraph || magazine.aboutUs?.storyQuote || ""
  );

  // Page 5 Back Cover
  const [backClosingQuote, setBackClosingQuote] = useState(magazine.backCover?.closingQuote || "");
  const [backSignature, setBackSignature] = useState(magazine.backCover?.signature || "");
  const [backSecretMessage, setBackSecretMessage] = useState(magazine.backCover?.secretMessage || "");

  const prevModalRef = useRef<string | null>(null);
  const prevEditingIdRef = useRef<string | null>(null);

  // Sync state ONLY when opened or when editingItem changes
  useEffect(() => {
    const justOpened = activeToolModal === "text" && prevModalRef.current !== "text";
    const editingChanged = editingTextId !== prevEditingIdRef.current;

    if (activeToolModal === "text" && (justOpened || editingChanged)) {
      if (editingItem) {
        setText(editingItem.text || "");
        setFontChoice(editingItem.fontStyle || "handwriting");
        setFontSize(editingItem.fontSize || "base");
        setCardStyle(editingItem.cardStyle || "transparent");
        setColor(editingItem.color || "#2c221e");
        setTargetPage(editingItem.pageIndex);
        setTextToolTab("add");
      } else {
        setText("");
        setFontChoice("handwriting");
        setFontSize("base");
        setCardStyle("transparent");
        setColor("#2c221e");
        const defaultPage =
          currentPage === 0
            ? 0
            : currentPage >= 5
            ? 5
            : currentPage <= 2
            ? (currentPage === 0 ? 0 : 1)
            : 3;
        setTargetPage(defaultPage);
        setHeaderPage(currentPage);
      }

      // Sync header inputs from current store values
      setCoverTitle(magazine.frontCover?.title || "");
      setCoverSubtitle(magazine.frontCover?.subtitle || "");
      setCoverDedication(magazine.frontCover?.dedication || "");

      setMemoryHeadline(magazine.memoryPage?.headline || "");
      setMemoryIntro(magazine.memoryPage?.introText || "");
      setMemoryBody(magazine.memoryPage?.bodyLetter || "");

      setPolaroidTitle(magazine.polaroidCollage?.title || "");
      setPolaroidNote(magazine.polaroidCollage?.note || "");

      setAboutTitle(magazine.aboutUs?.title || "");
      setAboutSubtitle(magazine.aboutUs?.subtitle || "");
      setAboutStory(magazine.aboutUs?.storyParagraph || magazine.aboutUs?.storyQuote || "");

      setBackClosingQuote(magazine.backCover?.closingQuote || "");
      setBackSignature(magazine.backCover?.signature || "");
      setBackSecretMessage(magazine.backCover?.secretMessage || "");

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }

    prevModalRef.current = activeToolModal;
    prevEditingIdRef.current = editingTextId;
  }, [activeToolModal, editingTextId, editingItem, currentPage, magazine, setTextToolTab]);

  if (activeToolModal !== "text") return null;

  // Handle Freeform Direct Text Submit
  const handleFreeformSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      alert("Please type some words or a message first.");
      return;
    }

    if (editingTextId && editingItem) {
      updatePlacedText(editingTextId, {
        text: text.trim(),
        fontStyle: fontChoice,
        fontSize,
        cardStyle,
        color,
        pageIndex: targetPage,
      });
    } else {
      addPlacedText({
        pageIndex: targetPage,
        text: text.trim(),
        fontStyle: fontChoice,
        fontSize,
        cardStyle,
        color,
        x: 50 + (Math.random() * 8 - 4),
        y: 50 + (Math.random() * 8 - 4),
        rotation: cardStyle === "tape" ? Math.round(Math.random() * 4 - 2) : 0,
        scale: 1,
      });
    }

    setActiveToolModal(null);
  };

  const handleDelete = () => {
    if (editingTextId) {
      removePlacedText(editingTextId);
      setActiveToolModal(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleFreeformSubmit();
    }
  };

  // Handle Page Headers & Story Save
  const handleSaveHeaders = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (headerPage === 0) {
      updateFrontCover({
        title: coverTitle.trim(),
        subtitle: coverSubtitle.trim(),
        dedication: coverDedication.trim(),
      });
    } else if (headerPage === 1) {
      updateMemoryPage({
        headline: memoryHeadline.trim(),
        introText: memoryIntro.trim(),
        bodyLetter: memoryBody.trim(),
      });
    } else if (headerPage === 2) {
      updatePolaroidCollage({
        title: polaroidTitle.trim(),
        note: polaroidNote.trim(),
      });
    } else if (headerPage === 3) {
      updateAboutUs({
        title: aboutTitle.trim(),
        subtitle: aboutSubtitle.trim(),
        storyParagraph: aboutStory.trim(),
      });
    } else if (headerPage === 5) {
      updateBackCover({
        closingQuote: backClosingQuote.trim(),
        signature: backSignature.trim(),
        secretMessage: backSecretMessage.trim(),
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveToolModal(null);
    }, 900);
  };

  const pageLabel =
    targetPage === 0
      ? "Front Cover"
      : targetPage === 5
      ? "Back Cover"
      : `Page ${targetPage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-[#fdfbf7] border-t-2 sm:border border-[#d4af37]/60 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#ebdccb] bg-[#f8f1e5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#faecee] border border-[#9e2a2b]/20 flex items-center justify-center">
              <Type className="w-3.5 h-3.5 text-[#9e2a2b]" />
            </div>
            <div>
              <h3 className="font-serif-dearly text-base font-bold text-[#581620]">
                {editingTextId
                  ? "Edit Placed Text"
                  : textToolTab === "headers"
                  ? "Edit Page Title & Story"
                  : "Add Direct Text"}
              </h3>
              <p className="text-[11px] text-[#7e695d]">
                {textToolTab === "headers"
                  ? "Customize headlines, subtitles, and story text for your book"
                  : "Pure direct text on the page background, or cute sticky notes"}
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

        {/* Tab Switcher: Direct Text vs Page Title & Story */}
        {!editingTextId && (
          <div className="flex border-b border-[#ebdccb] bg-[#f7efe4] px-4 pt-2 gap-2">
            <button
              type="button"
              onClick={() => setTextToolTab("add")}
              className={`pb-2.5 px-3 text-xs font-serif-dearly font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                textToolTab === "add"
                  ? "border-[#581620] text-[#581620]"
                  : "border-transparent text-[#7e695d] hover:text-[#581620]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <span>Direct Text &amp; Notes</span>
            </button>
            <button
              type="button"
              onClick={() => setTextToolTab("headers")}
              className={`pb-2.5 px-3 text-xs font-serif-dearly font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                textToolTab === "headers"
                  ? "border-[#581620] text-[#581620]"
                  : "border-transparent text-[#7e695d] hover:text-[#581620]"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <span>Page Title &amp; Story</span>
            </button>
          </div>
        )}

        {/* TAB 1: ADD DIRECT TEXT / STICKY NOTES */}
        {textToolTab === "add" && (
          <form onSubmit={handleFreeformSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Target Page Selector */}
            {spreadPages.length > 1 && (
              <div className="flex items-center justify-between bg-[#f5ecdf] p-1.5 rounded-lg border border-[#e2d5c3]">
                <span className="text-xs font-serif-dearly text-[#581620] font-semibold pl-1.5">
                  Place on:
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
                      Page {pg} {pg === 1 ? "(Memory)" : pg === 2 ? "(Photobooth)" : pg === 3 ? "(Story)" : "(Keepsake)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clean Textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#5a483e]">
                Your Text / Message
              </label>
              <textarea
                ref={textareaRef}
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your story, thoughts, caption, or love note here..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:ring-1 focus:ring-[#9e2a2b] focus:outline-hidden transition-all placeholder:text-[#ab9788]"
              />
              <div className="flex justify-between items-center text-[10px] text-[#8c7465] px-1">
                <span>Press <kbd className="px-1 py-0.5 bg-[#ebdccd] rounded text-[9px] font-mono">Ctrl+Enter</kbd> to save</span>
                <span>{text.length} characters</span>
              </div>
            </div>

            {/* Formatting Options */}
            <div className="space-y-3 bg-[#fbf7f0] p-3 rounded-xl border border-[#decbb7]">
              {/* Font Style */}
              <div>
                <span className="block text-[11px] font-medium text-[#6e584a] mb-1.5">
                  Font Style
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFontChoice("handwriting")}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-handwriting cursor-pointer transition-colors text-center ${
                      fontChoice === "handwriting"
                        ? "bg-[#581620] text-white border-[#581620] shadow-xs"
                        : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <PenTool className="w-3 h-3 text-[#d4af37]" />
                      <span>Cursive</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontChoice("serif")}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-serif-dearly italic cursor-pointer transition-colors text-center ${
                      fontChoice === "serif"
                        ? "bg-[#581620] text-white border-[#581620] shadow-xs"
                        : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#d4af37]" />
                      <span>Serif</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontChoice("mono")}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-colors text-center ${
                      fontChoice === "mono"
                        ? "bg-[#581620] text-white border-[#581620] shadow-xs"
                        : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Type className="w-3 h-3 text-[#d4af37]" />
                      <span>Typewriter</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontChoice("sans")}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-sans cursor-pointer transition-colors text-center ${
                      fontChoice === "sans"
                        ? "bg-[#581620] text-white border-[#581620] shadow-xs"
                        : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#d4af37]" />
                      <span>Sans</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Display Style & Font Size */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="block text-[11px] font-medium text-[#6e584a] mb-1.5">
                    Display Style
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCardStyle("transparent")}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        cardStyle === "transparent"
                          ? "bg-[#581620] text-white border-[#581620] shadow-xs font-semibold"
                          : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                      }`}
                      title="Pure text directly on the page background (No card / No lines)"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Direct</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardStyle("card")}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        cardStyle === "card"
                          ? "bg-[#581620] text-white border-[#581620] shadow-xs font-semibold"
                          : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                      }`}
                      title="Cute pastel sticky note"
                    >
                      <StickyNote className="w-3 h-3" />
                      <span>Sticky</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardStyle("tape")}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        cardStyle === "tape"
                          ? "bg-[#581620] text-white border-[#581620] shadow-xs font-semibold"
                          : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                      }`}
                      title="Washi tape label banner"
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>Tape</span>
                    </button>
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <span className="block text-[11px] font-medium text-[#6e584a] mb-1.5">
                    Text Size
                  </span>
                  <div className="flex gap-1.5">
                    {(["sm", "base", "lg", "xl"] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setFontSize(sz)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          fontSize === sz
                            ? "bg-[#581620] text-white border-[#581620] shadow-xs font-bold"
                            : "bg-white text-[#4a3a30] border-[#dfd0be] hover:bg-[#f8f1e5]"
                        }`}
                      >
                        {sz === "sm" ? "S" : sz === "base" ? "M" : sz === "lg" ? "L" : "XL"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ink Color */}
              <div className="pt-1">
                <span className="block text-[11px] font-medium text-[#6e584a] mb-1.5">
                  Ink Color
                </span>
                <div className="flex items-center gap-2">
                  {INK_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`w-7 h-7 rounded-full ${c.bg} transition-transform flex items-center justify-center cursor-pointer ${
                        color === c.value
                          ? "ring-2 ring-offset-2 ring-[#581620] scale-110"
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      title={c.name}
                    >
                      {color === c.value && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Text Preview Box */}
            {text && (
              <div className="space-y-1">
                <span className="block text-[11px] font-medium text-[#6e584a]">
                  Preview
                </span>
                <div className="p-3 bg-[#e8dac7]/40 rounded-xl border border-[#decbb7] flex items-center justify-center min-h-[60px]">
                  {cardStyle === "transparent" ? (
                    <p
                      className={`${
                        fontChoice === "serif"
                          ? "font-serif-dearly italic"
                          : fontChoice === "mono"
                          ? "font-mono"
                          : fontChoice === "sans"
                          ? "font-sans"
                          : "font-handwriting"
                      } ${
                        fontSize === "sm"
                          ? "text-xs"
                          : fontSize === "lg"
                          ? "text-lg"
                          : fontSize === "xl"
                          ? "text-xl font-bold"
                          : "text-sm"
                      } whitespace-pre-wrap text-center`}
                      style={{ color }}
                    >
                      {text}
                    </p>
                  ) : cardStyle === "tape" ? (
                    <div className="bg-[#faecd9]/90 px-3.5 py-1.5 border-y border-[#dfcbb7] shadow-2xs rotate-[-0.5deg]">
                      <p
                        className={`${
                          fontChoice === "serif"
                            ? "font-serif-dearly italic"
                            : fontChoice === "mono"
                            ? "font-mono"
                            : fontChoice === "sans"
                            ? "font-sans"
                            : "font-handwriting"
                        } ${
                          fontSize === "sm"
                            ? "text-xs"
                            : fontSize === "lg"
                            ? "text-lg"
                            : fontSize === "xl"
                            ? "text-xl font-bold"
                            : "text-sm"
                        } whitespace-pre-wrap text-center font-medium`}
                        style={{ color }}
                      >
                        {text}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#fffdf0] px-3.5 py-2.5 rounded-xs border border-[#ebdccb] shadow-xs max-w-xs rotate-[-0.5deg]">
                      <p
                        className={`${
                          fontChoice === "serif"
                            ? "font-serif-dearly italic"
                            : fontChoice === "mono"
                            ? "font-mono"
                            : fontChoice === "sans"
                            ? "font-sans"
                            : "font-handwriting"
                        } ${
                          fontSize === "sm"
                            ? "text-xs"
                            : fontSize === "lg"
                            ? "text-lg"
                            : fontSize === "xl"
                            ? "text-xl font-bold"
                            : "text-sm"
                        } whitespace-pre-wrap text-center`}
                        style={{ color }}
                      >
                        {text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#ebdccb]">
              {editingTextId ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#faebea] hover:bg-[#e63946] text-[#9e2a2b] hover:text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveToolModal(null)}
                  className="px-4 py-2 rounded-lg border border-[#dfd0be] text-xs font-medium text-[#695447] hover:bg-[#f8f1e5] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-xs font-medium cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
              >
                {editingTextId ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to {pageLabel}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: EDIT PAGE HEADERS & STORY */}
        {textToolTab === "headers" && (
          <form onSubmit={handleSaveHeaders} className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Page Chooser */}
            <div>
              <label className="block text-[11px] font-medium text-[#6e584a] mb-1.5">
                Select Page to Edit
              </label>
              <div className="grid grid-cols-5 gap-1 bg-[#f5ecdf] p-1.5 rounded-lg border border-[#e2d5c3]">
                <button
                  type="button"
                  onClick={() => setHeaderPage(0)}
                  className={`py-1.5 rounded-md text-[11px] font-serif-dearly transition-all cursor-pointer text-center ${
                    headerPage === 0
                      ? "bg-[#581620] text-[#fff8ee] font-bold shadow-xs"
                      : "text-[#695447] hover:text-[#581620]"
                  }`}
                >
                  Cover
                </button>
                <button
                  type="button"
                  onClick={() => setHeaderPage(1)}
                  className={`py-1.5 rounded-md text-[11px] font-serif-dearly transition-all cursor-pointer text-center ${
                    headerPage === 1
                      ? "bg-[#581620] text-[#fff8ee] font-bold shadow-xs"
                      : "text-[#695447] hover:text-[#581620]"
                  }`}
                >
                  Pg 1 (Memory)
                </button>
                <button
                  type="button"
                  onClick={() => setHeaderPage(2)}
                  className={`py-1.5 rounded-md text-[11px] font-serif-dearly transition-all cursor-pointer text-center ${
                    headerPage === 2
                      ? "bg-[#581620] text-[#fff8ee] font-bold shadow-xs"
                      : "text-[#695447] hover:text-[#581620]"
                  }`}
                >
                  Pg 2 (Strip)
                </button>
                <button
                  type="button"
                  onClick={() => setHeaderPage(3)}
                  className={`py-1.5 rounded-md text-[11px] font-serif-dearly transition-all cursor-pointer text-center ${
                    headerPage === 3
                      ? "bg-[#581620] text-[#fff8ee] font-bold shadow-xs"
                      : "text-[#695447] hover:text-[#581620]"
                  }`}
                >
                  Pg 3 (Story)
                </button>
                <button
                  type="button"
                  onClick={() => setHeaderPage(5)}
                  className={`py-1.5 rounded-md text-[11px] font-serif-dearly transition-all cursor-pointer text-center ${
                    headerPage === 5
                      ? "bg-[#581620] text-[#fff8ee] font-bold shadow-xs"
                      : "text-[#695447] hover:text-[#581620]"
                  }`}
                >
                  Back
                </button>
              </div>
            </div>

            {/* Inputs For Front Cover (0) */}
            {headerPage === 0 && (
              <div className="space-y-3 bg-[#fbf7f0] p-3.5 rounded-xl border border-[#decbb7]">
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Cover Title
                  </label>
                  <input
                    type="text"
                    value={coverTitle}
                    onChange={(e) => setCoverTitle(e.target.value)}
                    placeholder="OUR LITTLE UNIVERSE"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Cover Subtitle
                  </label>
                  <input
                    type="text"
                    value={coverSubtitle}
                    onChange={(e) => setCoverSubtitle(e.target.value)}
                    placeholder="A CHRONICLE OF US • VOL. I"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Bottom Dedication
                  </label>
                  <input
                    type="text"
                    value={coverDedication}
                    onChange={(e) => setCoverDedication(e.target.value)}
                    placeholder="For you, my favorite story in this world."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-base"
                  />
                </div>
              </div>
            )}

            {/* Inputs For Page 1: Memory */}
            {headerPage === 1 && (
              <div className="space-y-3 bg-[#fbf7f0] p-3.5 rounded-xl border border-[#decbb7]">
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Page Headline
                  </label>
                  <input
                    type="text"
                    value={memoryHeadline}
                    onChange={(e) => setMemoryHeadline(e.target.value)}
                    placeholder="OUR FAVORITE AFTERNOON IN THE RAIN"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-serif-dearly"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Top Text (Left of 1st Photo)
                  </label>
                  <textarea
                    rows={2}
                    value={memoryIntro}
                    onChange={(e) => setMemoryIntro(e.target.value)}
                    placeholder="A sudden afternoon rainstorm caught us by surprise..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Bottom Story Text (Right of 2nd Photo)
                  </label>
                  <textarea
                    rows={3}
                    value={memoryBody}
                    onChange={(e) => setMemoryBody(e.target.value)}
                    placeholder="Do you remember how the streetlamps began to flicker on outside?..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-base"
                  />
                </div>
              </div>
            )}

            {/* Inputs For Page 2: Photobooth Strip */}
            {headerPage === 2 && (
              <div className="space-y-3 bg-[#fbf7f0] p-3.5 rounded-xl border border-[#decbb7]">
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Photobooth Strip Title
                  </label>
                  <input
                    type="text"
                    value={polaroidTitle}
                    onChange={(e) => setPolaroidTitle(e.target.value)}
                    placeholder="Captured Moments"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-serif-dearly"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Caption / Note
                  </label>
                  <input
                    type="text"
                    value={polaroidNote}
                    onChange={(e) => setPolaroidNote(e.target.value)}
                    placeholder="Three glimpses into our favorite day"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-base"
                  />
                </div>
              </div>
            )}

            {/* Inputs For Page 3: Our Story */}
            {headerPage === 3 && (
              <div className="space-y-3 bg-[#fbf7f0] p-3.5 rounded-xl border border-[#decbb7]">
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    placeholder="The Day Everything Changed"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-serif-dearly"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={aboutSubtitle}
                    onChange={(e) => setAboutSubtitle(e.target.value)}
                    placeholder="How a quiet corner table turned into forever"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Story Paragraph
                  </label>
                  <textarea
                    rows={4}
                    value={aboutStory}
                    onChange={(e) => setAboutStory(e.target.value)}
                    placeholder="We started with a simple hello and a shared warm cappuccino..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-base leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Inputs For Page 5: Back Cover */}
            {headerPage === 5 && (
              <div className="space-y-3 bg-[#fbf7f0] p-3.5 rounded-xl border border-[#decbb7]">
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Closing Quote
                  </label>
                  <textarea
                    rows={2}
                    value={backClosingQuote}
                    onChange={(e) => setBackClosingQuote(e.target.value)}
                    placeholder="And so our story keeps on unfolding..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-serif-dearly italic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Signature / Sign-off
                  </label>
                  <input
                    type="text"
                    value={backSignature}
                    onChange={(e) => setBackSignature(e.target.value)}
                    placeholder="With all my love,\nAlways & Forever"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#581620] mb-1">
                    Secret Message (Under Wax Seal)
                  </label>
                  <textarea
                    rows={2}
                    value={backSecretMessage}
                    onChange={(e) => setBackSecretMessage(e.target.value)}
                    placeholder="P.S. You're still my favorite adventure."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-lg focus:border-[#9e2a2b] focus:outline-hidden font-handwriting text-base"
                  />
                </div>
              </div>
            )}

            {/* Save Button for Headers */}
            <div className="flex items-center justify-between pt-2 border-t border-[#ebdccb]">
              <button
                type="button"
                onClick={() => setActiveToolModal(null)}
                className="px-4 py-2 rounded-lg border border-[#dfd0be] text-xs font-medium text-[#695447] hover:bg-[#f8f1e5] cursor-pointer transition-colors"
              >
                Close
              </button>

              <button
                type="submit"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95 ${
                  saveSuccess
                    ? "bg-[#2d6a4f] text-white"
                    : "bg-[#581620] hover:bg-[#430f16] text-[#fff8ee]"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{saveSuccess ? "Saved to Book!" : "Save Page Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

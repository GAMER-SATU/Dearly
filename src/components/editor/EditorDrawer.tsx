"use client";

import React, { useState } from "react";
import { useMagazineStore, EditTab } from "@/store/useMagazineStore";
import { ImageUploadInput } from "@/components/editor/ImageUploadInput";
import { StickerPicker } from "@/components/editor/StickerPicker";
import {
  X,
  Check,
  Sparkles,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Users,
  Award,
  Feather,
  Trash2,
} from "lucide-react";

export const EditorDrawer: React.FC = () => {
  const {
    magazine,
    isEditing,
    setIsEditing,
    activeEditTab,
    setActiveEditTab,
    currentPage,
    setCurrentPage,
    updateFrontCover,
    updateMemoryPage,
    updatePolaroidCollage,
    updatePolaroidItem,
    updateAboutUs,
    updateBackCover,
    clearPlacedStickers,
  } = useMagazineStore();

  const [activeTabOverride, setActiveTabOverride] = useState<string | null>(null);

  if (!isEditing) return null;

  const currentTab = activeTabOverride || activeEditTab;

  const tabs: Array<{
    id: EditTab | "stickers";
    label: string;
    pageIndex?: number;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "cover", label: "Cover", pageIndex: 0, icon: BookOpen },
    { id: "memory", label: "Story (Pg 1)", pageIndex: 1, icon: FileText },
    { id: "polaroids", label: "Polaroids (Pg 2)", pageIndex: 2, icon: ImageIcon },
    { id: "about", label: "About Us (Pg 3)", pageIndex: 3, icon: Users },
    { id: "keepsake", label: "Keepsake (Pg 4)", pageIndex: 4, icon: Feather },
    { id: "back", label: "Back Cover", pageIndex: 5, icon: Award },
    { id: "stickers", label: "Stickers", icon: Sparkles },
  ];

  const handleTabSwitch = (tabId: EditTab | "stickers", pageIdx?: number) => {
    if (tabId === "stickers") {
      setActiveTabOverride("stickers");
    } else {
      setActiveTabOverride(null);
      setActiveEditTab(tabId);
      if (pageIdx !== undefined) {
        setCurrentPage(pageIdx);
      }
    }
  };

  const pageStickersCount = (magazine.placedStickers || []).filter(
    (s) => s.pageIndex === currentPage
  ).length;

  return (
    <aside
      aria-label="Magazine Editor"
      className="fixed bottom-0 inset-x-0 z-50 bg-[#fdfbf7] border-t-2 border-[#d4af37]/50 shadow-[0_-10px_35px_rgba(0,0,0,0.18)] max-h-[82vh] flex flex-col transition-all duration-300"
    >
      {/* Drawer Top Header */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-[#e9dcce] flex items-center justify-between bg-[#f8f2e7]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#9e2a2b]" />
          <h3 className="font-serif-dearly text-base font-bold text-[#581620]">
            Customize Your Memory Book
          </h3>
          <span className="hidden sm:inline text-xs text-[#8c7667]">
            (Edits &amp; uploads update live in the pages above)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#faecee] text-[#9e2a2b] font-medium border border-[#9e2a2b]/20">
            Page {currentPage === 0 ? "Cover" : currentPage} active
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-1.5 rounded-full hover:bg-[#e7d8c6] text-[#695447] transition-colors cursor-pointer"
            aria-label="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 px-4 sm:px-6 pt-2 bg-[#f4ebe0] border-b border-[#e5d5c3] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSwitch(tab.id, tab.pageIndex)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-xs font-serif-dearly tracking-wide whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#fdfbf7] text-[#581620] font-bold border-t-2 border-x border-[#d4af37]"
                  : "text-[#7a6456] hover:text-[#581620] hover:bg-[#ebdccb]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[52vh] space-y-4">
        {/* Cover Tab */}
        {currentTab === "cover" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Book Title (Gold Embossed)
                </label>
                <input
                  type="text"
                  value={magazine.frontCover.title}
                  onChange={(e) => updateFrontCover({ title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Subtitle / Subtitle Tag
                </label>
                <input
                  type="text"
                  value={magazine.frontCover.subtitle}
                  onChange={(e) => updateFrontCover({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Issue Season / Date
                </label>
                <input
                  type="text"
                  value={magazine.frontCover.issueDate}
                  onChange={(e) => updateFrontCover({ issueDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Dedication (Handwritten Script Note)
                </label>
                <input
                  type="text"
                  value={magazine.frontCover.dedication}
                  onChange={(e) =>
                    updateFrontCover({ dedication: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Memory Story Tab (Page 1) */}
        {currentTab === "memory" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Chapter Header
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.chapterTitle}
                  onChange={(e) =>
                    updateMemoryPage({ chapterTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.headline}
                  onChange={(e) =>
                    updateMemoryPage({ headline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Date / Location Badge
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.dateBadge}
                  onChange={(e) =>
                    updateMemoryPage({ dateBadge: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Handwritten Story Letter
              </label>
              <textarea
                rows={3}
                value={magazine.memoryPage.bodyLetter}
                onChange={(e) =>
                  updateMemoryPage({ bodyLetter: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
              />
            </div>

            {/* Featured Memory Photo with Drag & Drop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <ImageUploadInput
                label="Featured Memory Photo (Drag & drop or upload)"
                imageUrl={magazine.memoryPage.featuredPhotoUrl || ""}
                onImageChange={(url) =>
                  updateMemoryPage({ featuredPhotoUrl: url })
                }
                aspectRatio="square"
              />

              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Photo Caption
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.featuredPhotoCaption || ""}
                  onChange={(e) =>
                    updateMemoryPage({
                      featuredPhotoCaption: e.target.value,
                    })
                  }
                  placeholder="e.g. The day we talked until closing time."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md focus:outline-hidden focus:border-[#9e2a2b]"
                />
                <p className="text-[11px] text-[#8c7769] mt-1">
                  Appears in lovely handwritten script directly beneath the photo frame.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3 Polaroids Tab (Page 2) */}
        {currentTab === "polaroids" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Collage Title
                </label>
                <input
                  type="text"
                  value={magazine.polaroidCollage.title}
                  onChange={(e) =>
                    updatePolaroidCollage({ title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Collage Handwritten Note
                </label>
                <input
                  type="text"
                  value={magazine.polaroidCollage.note}
                  onChange={(e) =>
                    updatePolaroidCollage({ note: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#581620]">
                3 Scrapbook Polaroid Photos (Drag &amp; Drop or Upload)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {magazine.polaroidCollage.polaroids.map((p, index) => (
                  <div
                    key={p.id || index}
                    className="p-3 bg-[#fdfbf7] border border-[#dfd2c0] rounded-xl space-y-2.5 shadow-2xs"
                  >
                    <span className="text-xs font-bold text-[#8c6b54] font-serif-dearly">
                      Polaroid #{index + 1}
                    </span>

                    <ImageUploadInput
                      label={`Photo #${index + 1}`}
                      imageUrl={p.imageUrl}
                      onImageChange={(url) =>
                        updatePolaroidItem(index, { imageUrl: url })
                      }
                      aspectRatio="square"
                    />

                    <div>
                      <label className="block text-[11px] font-medium text-[#6b584c] mb-0.5">
                        Handwritten Caption
                      </label>
                      <input
                        type="text"
                        value={p.caption}
                        onChange={(e) => {
                          updatePolaroidItem(index, { caption: e.target.value });
                        }}
                        className="w-full px-2.5 py-1 text-xs border border-[#dfd2c0] rounded-md bg-white text-[#34241d]"
                        placeholder="Caption..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Us Tab (Page 3) */}
        {currentTab === "about" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={magazine.aboutUs.title}
                    onChange={(e) => updateAboutUs({ title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                    Subtitle / Story Tag
                  </label>
                  <input
                    type="text"
                    value={magazine.aboutUs.subtitle}
                    onChange={(e) => updateAboutUs({ subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                    Story Quote
                  </label>
                  <textarea
                    rows={2}
                    value={magazine.aboutUs.storyQuote}
                    onChange={(e) =>
                      updateAboutUs({ storyQuote: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                    P.S. Handwritten Note
                  </label>
                  <input
                    type="text"
                    value={magazine.aboutUs.handwrittenNote}
                    onChange={(e) =>
                      updateAboutUs({ handwrittenNote: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Couple Portrait Photo (Drag & drop or upload)"
                  imageUrl={magazine.aboutUs.mainImageUrl}
                  onImageChange={(url) => updateAboutUs({ mainImageUrl: url })}
                  aspectRatio="portrait"
                />
              </div>
            </div>
          </div>
        )}

        {/* Keepsake Tab (Page 4) */}
        {currentTab === "keepsake" && (
          <div className="space-y-4 bg-[#fbf8f2] p-4 rounded-xl border border-[#decbb7]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-dearly text-sm font-bold text-[#581620]">
                  Page 4: Keepsake Blank Journal Page
                </h4>
                <p className="text-xs text-[#7e6758] mt-0.5">
                  Kept serene and open for custom stickers and handwritten memories.
                </p>
              </div>
            </div>

            <StickerPicker label="Add Stickers to this Keepsake Page" />
          </div>
        )}

        {/* Back Cover Tab (Page 5) */}
        {currentTab === "back" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                The Final Closing Quote
              </label>
              <textarea
                rows={2}
                value={magazine.backCover.closingQuote}
                onChange={(e) =>
                  updateBackCover({ closingQuote: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Signature
                </label>
                <input
                  type="text"
                  value={magazine.backCover.signature}
                  onChange={(e) =>
                    updateBackCover({ signature: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Secret Revealed Note (Under Wax Seal)
                </label>
                <input
                  type="text"
                  value={magazine.backCover.secretMessage || ""}
                  onChange={(e) =>
                    updateBackCover({ secretMessage: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d8c8b6] rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Stickers Catalog Tab */}
        {currentTab === "stickers" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-dearly text-sm font-bold text-[#581620]">
                  Stickers &amp; Scrapbook Elements
                </h4>
                <p className="text-xs text-[#7e6758]">
                  Click any sticker to place on active Page {currentPage === 0 ? "Cover" : currentPage}. Drag anywhere, rotate 15°, or remove.
                </p>
              </div>

              {pageStickersCount > 0 && (
                <button
                  type="button"
                  onClick={() => clearPlacedStickers(currentPage)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#faebea] hover:bg-[#e63946] text-[#9e2a2b] hover:text-white transition-colors cursor-pointer"
                  title="Clear all stickers from this page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Page Stickers ({pageStickersCount})</span>
                </button>
              )}
            </div>

            <StickerPicker label="Available Stickers Catalog" />
          </div>
        )}
      </div>

      {/* Done Editing Footer */}
      <div className="px-6 py-2.5 bg-[#f8f2e7] border-t border-[#e9dcce] flex items-center justify-between">
        <span className="text-[11px] text-[#8c7768] font-mono">
          Dearly Keepsake Studio
        </span>

        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#581620] hover:bg-[#430f16] text-[#fff6f0] text-xs font-medium cursor-pointer shadow-xs transition-colors hover:scale-105 active:scale-95"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save &amp; View Book</span>
        </button>
      </div>
    </aside>
  );
};

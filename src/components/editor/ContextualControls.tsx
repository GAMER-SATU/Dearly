"use client";

import React from "react";
import { useMagazineStore } from "@/store/useMagazineStore";
import { StickerPicker } from "@/components/editor/StickerPicker";
import { ImageUploadInput } from "@/components/editor/ImageUploadInput";
import { RotateCcw, Sparkles } from "lucide-react";

export const ContextualControls: React.FC = () => {
  const {
    magazine,
    currentPage,
    updateFrontCover,
    updateMemoryPage,
    updatePolaroidCollage,
    updatePolaroidItem,
    updateAboutUs,
    updateBackCover,
    setPageSticker,
    resetPage,
  } = useMagazineStore();

  const handleResetCurrentPage = () => {
    resetPage(currentPage);
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] border-l border-[#dfd2c0] shadow-xs">
      {/* Contextual Header */}
      <div className="p-4 border-b border-[#ebdccb] bg-[#f8f1e5] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9e2a2b] font-semibold">
            Fixed Template Editor
          </span>
          <h2 className="font-serif-dearly text-base font-bold text-[#581620]">
            {currentPage === 0 && "Cover Controls"}
            {currentPage === 1 && "Page 1: Memory Story"}
            {currentPage === 2 && "Page 2: 3 Polaroids"}
            {currentPage === 3 && "Page 3: About Us"}
            {currentPage === 4 && "Page 4: Blank Keepsake Page"}
            {currentPage === 5 && "Page 5: Back Cover (The Final Note)"}
          </h2>
        </div>

        {/* Reset Current Page button */}
        <button
          type="button"
          onClick={handleResetCurrentPage}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#ebdccd] hover:bg-[#dfcbb7] text-[#581620] transition-colors cursor-pointer"
          title="Reset this page to default"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Page</span>
        </button>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* ================= COVER CONTROLS ================= */}
        {currentPage === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Magazine Title (Serif Gold Emboss)
              </label>
              <input
                type="text"
                value={magazine.frontCover.title}
                onChange={(e) => updateFrontCover({ title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md focus:border-[#9e2a2b] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Subtitle / Issue Tag
              </label>
              <input
                type="text"
                value={magazine.frontCover.subtitle}
                onChange={(e) => updateFrontCover({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md focus:border-[#9e2a2b] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Issue Date / Season Badge
              </label>
              <input
                type="text"
                value={magazine.frontCover.issueDate}
                onChange={(e) => updateFrontCover({ issueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md focus:border-[#9e2a2b] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Dedication (Handwritten Script Note)
              </label>
              <textarea
                rows={2}
                value={magazine.frontCover.dedication}
                onChange={(e) => updateFrontCover({ dedication: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md focus:border-[#9e2a2b] focus:outline-hidden"
              />
            </div>

            {/* Sticker Selector */}
            <div className="pt-2 border-t border-[#ebdccb]">
              <StickerPicker
                label="Cover Emblem / Sticker"
                currentSticker={magazine.frontCover.sticker}
                onSelectSticker={(src) => setPageSticker(0, src)}
              />
            </div>
          </div>
        )}

        {/* ================= PAGE 1: MEMORY CONTROLS ================= */}
        {currentPage === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Chapter Label
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.chapterTitle}
                  onChange={(e) =>
                    updateMemoryPage({ chapterTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Date Badge
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.dateBadge}
                  onChange={(e) =>
                    updateMemoryPage({ dateBadge: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
                />
              </div>
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
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Location Stamp
              </label>
              <input
                type="text"
                value={magazine.memoryPage.locationStamp}
                onChange={(e) =>
                  updateMemoryPage({ locationStamp: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Top Left Small Paragraph / Intro
              </label>
              <textarea
                rows={3}
                value={magazine.memoryPage.introText ?? ""}
                placeholder="Intro reflection or memory snippet..."
                onChange={(e) =>
                  updateMemoryPage({ introText: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md focus:border-[#9e2a2b] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Bottom Right Story Letter
              </label>
              <textarea
                rows={4}
                value={magazine.memoryPage.bodyLetter}
                placeholder="Full story or heartfelt memory letter..."
                onChange={(e) =>
                  updateMemoryPage({ bodyLetter: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md focus:border-[#9e2a2b] focus:outline-hidden"
              />
            </div>

            {/* Photo 1: Top Right */}
            <div className="pt-2 border-t border-[#ebdccb] space-y-2">
              <span className="text-xs font-bold text-[#581620] uppercase tracking-wider block">
                Photo 1 (Top Right)
              </span>
              <ImageUploadInput
                label="Photo 1 (Top Right)"
                imageUrl={magazine.memoryPage.featuredPhotoUrl}
                onImageChange={(url) =>
                  updateMemoryPage({ featuredPhotoUrl: url })
                }
              />
              <div>
                <label className="block text-[11px] font-semibold text-[#665042] mb-0.5">
                  Photo 1 Caption
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.featuredPhotoCaption}
                  onChange={(e) =>
                    updateMemoryPage({ featuredPhotoCaption: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#dfd0be] rounded-md"
                />
              </div>
            </div>

            {/* Photo 2: Bottom Left */}
            <div className="pt-2 border-t border-[#ebdccb] space-y-2">
              <span className="text-xs font-bold text-[#581620] uppercase tracking-wider block">
                Photo 2 (Bottom Left)
              </span>
              <ImageUploadInput
                label="Photo 2 (Bottom Left)"
                imageUrl={
                  magazine.memoryPage.secondPhotoUrl ||
                  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                }
                onImageChange={(url) =>
                  updateMemoryPage({ secondPhotoUrl: url })
                }
              />
              <div>
                <label className="block text-[11px] font-semibold text-[#665042] mb-0.5">
                  Photo 2 Caption
                </label>
                <input
                  type="text"
                  value={magazine.memoryPage.secondPhotoCaption ?? ""}
                  onChange={(e) =>
                    updateMemoryPage({ secondPhotoCaption: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#dfd0be] rounded-md"
                />
              </div>
            </div>

            {/* Sticker Selector */}
            <div className="pt-2 border-t border-[#ebdccb]">
              <StickerPicker
                label="Page 1 Postage / Stamp Sticker"
                currentSticker={magazine.memoryPage.sticker}
                onSelectSticker={(src) => setPageSticker(1, src)}
              />
            </div>
          </div>
        )}

        {/* ================= PAGE 2: 3 POLAROIDS CONTROLS ================= */}
        {currentPage === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
                  className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                  Subtitle Note
                </label>
                <input
                  type="text"
                  value={magazine.polaroidCollage.note}
                  onChange={(e) =>
                    updatePolaroidCollage({ note: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
                />
              </div>
            </div>

            {/* 3 Images Upload / Replace */}
            <div className="space-y-4 pt-2 border-t border-[#ebdccb]">
              <span className="text-xs font-bold text-[#581620] uppercase tracking-wider block">
                Photobooth Strip Photos (Single Frame)
              </span>

              {magazine.polaroidCollage.polaroids.map((polaroid, idx) => (
                <div
                  key={polaroid.id || idx}
                  className="p-3 bg-[#f8f3ec] border border-[#dfd2c0] rounded-lg space-y-2 shadow-2xs"
                >
                  <span className="text-xs font-semibold text-[#7e6252]">
                    Strip Photo #{idx + 1}
                  </span>

                  <ImageUploadInput
                    label={`Photo #${idx + 1} Upload / Replace`}
                    imageUrl={polaroid.imageUrl}
                    onImageChange={(url) =>
                      updatePolaroidItem(idx, { imageUrl: url })
                    }
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-[#665042] mb-0.5">
                      Handwritten Caption
                    </label>
                    <input
                      type="text"
                      value={polaroid.caption}
                      onChange={(e) =>
                        updatePolaroidItem(idx, { caption: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#dfd0be] rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Sticker Selector */}
            <div className="pt-2 border-t border-[#ebdccb]">
              <StickerPicker
                label="Page 2 Scrapbook Clip / Sticker"
                currentSticker={magazine.polaroidCollage.sticker}
                onSelectSticker={(src) => setPageSticker(2, src)}
              />
            </div>
          </div>
        )}

        {/* ================= PAGE 3: ABOUT US / OUR STORY CONTROLS ================= */}
        {currentPage === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Story Title
              </label>
              <input
                type="text"
                value={magazine.aboutUs.title}
                onChange={(e) => updateAboutUs({ title: e.target.value })}
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={magazine.aboutUs.subtitle}
                onChange={(e) => updateAboutUs({ subtitle: e.target.value })}
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            {/* One Main Image Upload / Replace */}
            <div className="pt-2 border-t border-[#ebdccb]">
              <ImageUploadInput
                label="Center Story Photo (Above Text)"
                imageUrl={magazine.aboutUs.mainImageUrl}
                aspectRatio="portrait"
                onImageChange={(url) => updateAboutUs({ mainImageUrl: url })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Story Paragraph (Written below center photo)
              </label>
              <textarea
                rows={5}
                value={magazine.aboutUs.storyParagraph ?? ""}
                placeholder="Write your story paragraph here..."
                onChange={(e) => updateAboutUs({ storyParagraph: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Story Quote Banner (Optional)
              </label>
              <input
                type="text"
                value={magazine.aboutUs.storyQuote}
                onChange={(e) => updateAboutUs({ storyQuote: e.target.value })}
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            {/* Milestones list */}
            <div className="space-y-2 pt-2 border-t border-[#ebdccb]">
              <label className="block text-xs font-semibold text-[#5a483e]">
                Milestone Highlights
              </label>
              {magazine.aboutUs.milestones.map((m, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={m.date}
                    placeholder="Date"
                    onChange={(e) => {
                      const updated = [...magazine.aboutUs.milestones];
                      updated[idx] = { ...m, date: e.target.value };
                      updateAboutUs({ milestones: updated });
                    }}
                    className="w-24 px-2 py-1 text-xs bg-white border border-[#dfd0be] rounded-md"
                  />
                  <input
                    type="text"
                    value={m.event}
                    placeholder="Memory event"
                    onChange={(e) => {
                      const updated = [...magazine.aboutUs.milestones];
                      updated[idx] = { ...m, event: e.target.value };
                      updateAboutUs({ milestones: updated });
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-white border border-[#dfd0be] rounded-md"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Handwritten P.S. Note
              </label>
              <input
                type="text"
                value={magazine.aboutUs.handwrittenNote}
                onChange={(e) =>
                  updateAboutUs({ handwrittenNote: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            {/* Sticker Selector */}
            <div className="pt-2 border-t border-[#ebdccb]">
              <StickerPicker
                label="About Page Botanical / Sticker"
                currentSticker={magazine.aboutUs.sticker}
                onSelectSticker={(src) => setPageSticker(3, src)}
              />
            </div>
          </div>
        )}

        {/* ================= PAGE 4: BLANK KEEPSAKE CONTROLS ================= */}
        {currentPage === 4 && (
          <div className="space-y-4">
            <div className="bg-[#fbf7f0] p-4 rounded-xl border border-[#decbb7]">
              <h4 className="font-serif-dearly text-sm font-bold text-[#581620]">
                Keepsake Journal Page
              </h4>
              <p className="text-xs text-[#7e6758] mt-1">
                This page remains unprinted and quiet for your personal keepsakes, stickers, and unwritten memories.
              </p>
            </div>

            <div className="pt-2">
              <StickerPicker
                label="Place Stickers on Page 4"
                onSelectSticker={(src) => setPageSticker(4, src)}
              />
            </div>
          </div>
        )}

        {/* ================= PAGE 5: BACK COVER CONTROLS ================= */}
        {currentPage === 5 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Closing Note (Italic Serif)
              </label>
              <textarea
                rows={3}
                value={magazine.backCover.closingQuote}
                onChange={(e) =>
                  updateBackCover({ closingQuote: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Handwritten Signature
              </label>
              <input
                type="text"
                value={magazine.backCover.signature}
                onChange={(e) => updateBackCover({ signature: e.target.value })}
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Secret Revealed Note (Tapped under Wax Seal)
              </label>
              <input
                type="text"
                value={magazine.backCover.secretMessage}
                onChange={(e) =>
                  updateBackCover({ secretMessage: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a483e] mb-1">
                Edition Label
              </label>
              <input
                type="text"
                value={magazine.backCover.editionText}
                onChange={(e) =>
                  updateBackCover({ editionText: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#dfd0be] rounded-md"
              />
            </div>

            {/* Sticker Selector */}
            <div className="pt-2 border-t border-[#ebdccb]">
              <StickerPicker
                label="Back Cover Wax Seal / Emblem"
                currentSticker={magazine.backCover.sticker}
                onSelectSticker={(src) => setPageSticker(5, src)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

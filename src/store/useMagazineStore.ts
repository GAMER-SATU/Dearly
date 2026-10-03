import { create } from "zustand";
import {
  MagazineData,
  FrontCoverData,
  MemoryPageData,
  PolaroidCollageData,
  PolaroidItem,
  AboutUsData,
  BackCoverData,
  PlacedSticker,
  PlacedImage,
  PlacedText,
} from "@/types/magazine";
import { defaultMagazineData } from "@/lib/defaultMagazine";

export type EditTab =
  | "cover"
  | "memory"
  | "polaroids"
  | "about"
  | "keepsake"
  | "back"
  | "stickers";

export type ToolModalType = "stickers" | "image" | "text" | null;

const TAB_INDEX_MAP: Partial<Record<EditTab, number>> = {
  cover: 0,
  memory: 1,
  polaroids: 2,
  about: 3,
  keepsake: 4,
  back: 5,
};

const INDEX_TAB_LIST: EditTab[] = [
  "cover",
  "memory",
  "polaroids",
  "about",
  "keepsake",
  "back",
];

interface MagazineStoreState {
  magazine: MagazineData;
  currentPage: number; // 0 to 5
  totalPages: number;
  isEditing: boolean;
  activeEditTab: EditTab;
  activeToolModal: ToolModalType;
  editingTextId: string | null;
  textToolTab: "add" | "headers";

  // Navigation & Direct Tool Openers
  isReadOnly: boolean;
  setIsReadOnly: (readOnly: boolean) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setIsEditing: (editing: boolean) => void;
  toggleEditing: () => void;
  setActiveEditTab: (tab: EditTab) => void;
  setActiveToolModal: (modal: ToolModalType) => void;
  setTextToolTab: (tab: "add" | "headers") => void;
  openTextEditor: (textId?: string | null) => void;
  openPageHeadersEditor: (pageIndex?: number) => void;

  // Page Content Updates (Instant reactive live preview)
  updateFrontCover: (data: Partial<FrontCoverData>) => void;
  updateMemoryPage: (data: Partial<MemoryPageData>) => void;
  updatePolaroidCollage: (data: Partial<PolaroidCollageData>) => void;
  updatePolaroidItem: (index: number, item: Partial<PolaroidItem>) => void;
  updateAboutUs: (data: Partial<AboutUsData>) => void;
  updateBackCover: (data: Partial<BackCoverData>) => void;

  // Freeform Placed Stickers (anywhere on the book)
  addPlacedSticker: (sticker: Omit<PlacedSticker, "id">) => void;
  updatePlacedSticker: (id: string, updates: Partial<PlacedSticker>) => void;
  removePlacedSticker: (id: string) => void;
  clearPlacedStickers: (pageIndex?: number) => void;

  // Freeform Placed Images (especially Page 4, and anywhere on the book)
  addPlacedImage: (image: Omit<PlacedImage, "id">) => void;
  updatePlacedImage: (id: string, updates: Partial<PlacedImage>) => void;
  removePlacedImage: (id: string) => void;

  // Freeform Placed Texts (especially Page 4, and anywhere on the book)
  addPlacedText: (text: Omit<PlacedText, "id">) => void;
  updatePlacedText: (id: string, updates: Partial<PlacedText>) => void;
  removePlacedText: (id: string) => void;

  // Legacy Single Sticker Selector
  setPageSticker: (pageIndex: number, stickerSrc: string) => void;

  // Reset controls
  resetPage: (pageIndex: number) => void;
  resetToDefault: () => void;
  setMagazine: (magazine: MagazineData) => void;
}

export const useMagazineStore = create<MagazineStoreState>((set) => ({
  magazine: defaultMagazineData,
  currentPage: 0,
  totalPages: 6,
  isEditing: false,
  activeEditTab: "cover",
  activeToolModal: null,
  editingTextId: null,
  textToolTab: "add",
  isReadOnly: false,
  setIsReadOnly: (isReadOnly) => set({ isReadOnly, activeToolModal: isReadOnly ? null : undefined }),

  setCurrentPage: (page) =>
    set((state) => {
      const clamped = Math.max(0, Math.min(page, state.totalPages - 1));
      return {
        currentPage: clamped,
        activeEditTab: INDEX_TAB_LIST[clamped] || "cover",
      };
    }),

  nextPage: () =>
    set((state) => {
      const next = Math.min(state.currentPage + 1, state.totalPages - 1);
      return {
        currentPage: next,
        activeEditTab: INDEX_TAB_LIST[next] || "cover",
      };
    }),

  prevPage: () =>
    set((state) => {
      const prev = Math.max(state.currentPage - 1, 0);
      return {
        currentPage: prev,
        activeEditTab: INDEX_TAB_LIST[prev] || "cover",
      };
    }),

  setIsEditing: (isEditing) => set({ isEditing }),

  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),

  setActiveEditTab: (activeEditTab) =>
    set((state) => ({
      activeEditTab,
      currentPage:
        activeEditTab === "stickers"
          ? state.currentPage
          : (TAB_INDEX_MAP[activeEditTab] ?? state.currentPage),
    })),

  updateFrontCover: (data) =>
    set((state) => ({
      magazine: {
        ...state.magazine,
        frontCover: { ...state.magazine.frontCover, ...data },
      },
    })),

  updateMemoryPage: (data) =>
    set((state) => ({
      magazine: {
        ...state.magazine,
        memoryPage: { ...state.magazine.memoryPage, ...data },
      },
    })),

  updatePolaroidCollage: (data) =>
    set((state) => ({
      magazine: {
        ...state.magazine,
        polaroidCollage: { ...state.magazine.polaroidCollage, ...data },
      },
    })),

  updatePolaroidItem: (index, item) =>
    set((state) => {
      const newPolaroids = [
        ...state.magazine.polaroidCollage.polaroids,
      ] as [PolaroidItem, PolaroidItem, PolaroidItem];
      if (newPolaroids[index]) {
        newPolaroids[index] = { ...newPolaroids[index], ...item };
      }
      return {
        magazine: {
          ...state.magazine,
          polaroidCollage: {
            ...state.magazine.polaroidCollage,
            polaroids: newPolaroids,
          },
        },
      };
    }),

  updateAboutUs: (data) =>
    set((state) => ({
      magazine: {
        ...state.magazine,
        aboutUs: { ...state.magazine.aboutUs, ...data },
      },
    })),

  updateBackCover: (data) =>
    set((state) => ({
      magazine: {
        ...state.magazine,
        backCover: { ...state.magazine.backCover, ...data },
      },
    })),

  addPlacedSticker: (sticker) =>
    set((state) => {
      const id = `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newSticker: PlacedSticker = { ...sticker, id };
      const currentList = state.magazine.placedStickers || [];
      return {
        magazine: {
          ...state.magazine,
          placedStickers: [...currentList, newSticker],
        },
      };
    }),

  updatePlacedSticker: (id, updates) =>
    set((state) => {
      const currentList = state.magazine.placedStickers || [];
      return {
        magazine: {
          ...state.magazine,
          placedStickers: currentList.map((st) =>
            st.id === id ? { ...st, ...updates } : st
          ),
        },
      };
    }),

  removePlacedSticker: (id) =>
    set((state) => {
      const currentList = state.magazine.placedStickers || [];
      return {
        magazine: {
          ...state.magazine,
          placedStickers: currentList.filter((st) => st.id !== id),
        },
      };
    }),

  clearPlacedStickers: (pageIndex) =>
    set((state) => {
      const currentList = state.magazine.placedStickers || [];
      return {
        magazine: {
          ...state.magazine,
          placedStickers:
            pageIndex !== undefined
              ? currentList.filter((st) => st.pageIndex !== pageIndex)
              : [],
        },
      };
    }),

  setActiveToolModal: (modal) =>
    set((state) => ({
      activeToolModal: modal,
      editingTextId: modal === "text" ? state.editingTextId : null,
      textToolTab: modal === "text" ? state.textToolTab : "add",
    })),

  setTextToolTab: (tab) => set({ textToolTab: tab }),

  openTextEditor: (textId) =>
    set({
      activeToolModal: "text",
      textToolTab: "add",
      editingTextId: textId || null,
    }),

  openPageHeadersEditor: (pageIndex) =>
    set((state) => ({
      activeToolModal: "text",
      textToolTab: "headers",
      currentPage: pageIndex !== undefined ? pageIndex : state.currentPage,
      editingTextId: null,
    })),

  addPlacedImage: (image) =>
    set((state) => {
      const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newImg: PlacedImage = { ...image, id };
      const currentList = state.magazine.placedImages || [];
      return {
        magazine: {
          ...state.magazine,
          placedImages: [...currentList, newImg],
        },
      };
    }),

  updatePlacedImage: (id, updates) =>
    set((state) => {
      const currentList = state.magazine.placedImages || [];
      return {
        magazine: {
          ...state.magazine,
          placedImages: currentList.map((img) =>
            img.id === id ? { ...img, ...updates } : img
          ),
        },
      };
    }),

  removePlacedImage: (id) =>
    set((state) => {
      const currentList = state.magazine.placedImages || [];
      return {
        magazine: {
          ...state.magazine,
          placedImages: currentList.filter((img) => img.id !== id),
        },
      };
    }),

  addPlacedText: (text) =>
    set((state) => {
      const id = `txt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newTxt: PlacedText = { ...text, id };
      const currentList = state.magazine.placedTexts || [];
      return {
        magazine: {
          ...state.magazine,
          placedTexts: [...currentList, newTxt],
        },
      };
    }),

  updatePlacedText: (id, updates) =>
    set((state) => {
      const currentList = state.magazine.placedTexts || [];
      return {
        magazine: {
          ...state.magazine,
          placedTexts: currentList.map((txt) =>
            txt.id === id ? { ...txt, ...updates } : txt
          ),
        },
      };
    }),

  removePlacedText: (id) =>
    set((state) => {
      const currentList = state.magazine.placedTexts || [];
      return {
        magazine: {
          ...state.magazine,
          placedTexts: currentList.filter((txt) => txt.id !== id),
        },
      };
    }),

  setPageSticker: (pageIndex, stickerSrc) =>
    set((state) => {
      const mag = { ...state.magazine };
      if (pageIndex === 0) mag.frontCover = { ...mag.frontCover, sticker: stickerSrc };
      else if (pageIndex === 1) mag.memoryPage = { ...mag.memoryPage, sticker: stickerSrc };
      else if (pageIndex === 2) mag.polaroidCollage = { ...mag.polaroidCollage, sticker: stickerSrc };
      else if (pageIndex === 3) mag.aboutUs = { ...mag.aboutUs, sticker: stickerSrc };
      else if (pageIndex === 5) mag.backCover = { ...mag.backCover, sticker: stickerSrc };
      return { magazine: mag };
    }),

  resetPage: (pageIndex) =>
    set((state) => {
      const mag = { ...state.magazine };
      if (pageIndex === 0) mag.frontCover = { ...defaultMagazineData.frontCover };
      else if (pageIndex === 1) mag.memoryPage = { ...defaultMagazineData.memoryPage };
      else if (pageIndex === 2) mag.polaroidCollage = { ...defaultMagazineData.polaroidCollage };
      else if (pageIndex === 3) mag.aboutUs = { ...defaultMagazineData.aboutUs };
      else if (pageIndex === 5) mag.backCover = { ...defaultMagazineData.backCover };
      return { magazine: mag };
    }),

  resetToDefault: () =>
    set({
      magazine: defaultMagazineData,
      currentPage: 0,
      activeEditTab: "cover",
    }),

  setMagazine: (magazine) => set({ magazine }),
}));


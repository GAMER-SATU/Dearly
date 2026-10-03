export interface PolaroidItem {
  id: string;
  imageUrl: string;
  caption: string;
  rotation?: number;
}

export interface FrontCoverData {
  title: string;
  subtitle: string;
  issueDate: string;
  dedication: string;
  accentColor: string;
  sticker: string;
}

export interface MemoryPageData {
  chapterTitle: string;
  headline: string;
  dateBadge: string;
  locationStamp: string;
  introText?: string;
  bodyLetter: string;
  featuredPhotoUrl: string;
  featuredPhotoCaption: string;
  secondPhotoUrl?: string;
  secondPhotoCaption?: string;
  sticker: string;
}

export interface PolaroidCollageData {
  title: string;
  note: string;
  polaroids: [PolaroidItem, PolaroidItem, PolaroidItem];
  sticker: string;
}

export interface AboutUsData {
  title: string;
  subtitle: string;
  mainImageUrl: string;
  storyQuote: string;
  storyParagraph?: string;
  milestones: Array<{
    date: string;
    event: string;
  }>;
  handwrittenNote: string;
  sticker: string;
}

export interface BackCoverData {
  closingQuote: string;
  signature: string;
  editionText: string;
  secretMessage: string;
  waxSealColor: string;
  sticker: string;
}

export interface PlacedSticker {
  id: string;
  pageIndex: number;
  src: string;
  name?: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  rotation?: number; // degrees
  scale?: number;
}

export interface PlacedImage {
  id: string;
  pageIndex: number;
  src: string;
  caption?: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  rotation?: number; // degrees
  scale?: number;
}

export interface PlacedText {
  id: string;
  pageIndex: number;
  text: string;
  fontStyle?: "handwriting" | "serif" | "mono" | "sans";
  fontSize?: "sm" | "base" | "lg" | "xl";
  cardStyle?: "transparent" | "card" | "tape";
  color?: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  rotation?: number; // degrees
  scale?: number;
}

export interface MagazineData {
  id: string;
  title: string;
  createdAt: string;
  expiresAt?: string;
  frontCover: FrontCoverData;
  memoryPage: MemoryPageData;
  polaroidCollage: PolaroidCollageData;
  aboutUs: AboutUsData;
  backCover: BackCoverData;
  placedStickers?: PlacedSticker[];
  placedImages?: PlacedImage[];
  placedTexts?: PlacedText[];
}

export interface StickerOption {
  id: string;
  name: string;
  src: string;
  category: string;
}

export const AVAILABLE_STICKERS: StickerOption[] = [
  // Florals & Bouquets (from src/stickers)
  { id: "stk-bq1", name: "Pastel Bouquet", src: "/stickers/bq1.png", category: "Florals & Nature" },
  { id: "stk-bq2", name: "Blush Peony", src: "/stickers/bq2.png", category: "Florals & Nature" },
  { id: "stk-bq3", name: "Autumn Blossom", src: "/stickers/bq3.png", category: "Florals & Nature" },
  { id: "stk-bq4", name: "Rose Elegance", src: "/stickers/bq4.png", category: "Florals & Nature" },
  { id: "stk-bq5", name: "Spring Meadow", src: "/stickers/bq5.png", category: "Florals & Nature" },
  { id: "stk-bq6", name: "Lavender Spray", src: "/stickers/bq6.png", category: "Florals & Nature" },
  { id: "stk-bq7", name: "Sunset Bloom", src: "/stickers/bq7.png", category: "Florals & Nature" },
  { id: "stk-bq8", name: "Vintage Daisy", src: "/stickers/bq8.png", category: "Florals & Nature" },
  { id: "stk-bq9", name: "Coral Rose Bouquet", src: "/stickers/bq9.png", category: "Florals & Nature" },
  { id: "stk-bq10", name: "Petal Symphony", src: "/stickers/bq10.png", category: "Florals & Nature" },
  { id: "stk-bq11", name: "Botanical Posy", src: "/stickers/bq11.png", category: "Florals & Nature" },
  { id: "stk-bq12", name: "Garden Radiance", src: "/stickers/bq12.png", category: "Florals & Nature" },
  { id: "stk-flowerbouquet", name: "Wildflower Bouquet", src: "/stickers/flowerbouquet.png", category: "Florals & Nature" },
  { id: "stk-sunflower", name: "Sunny Sunflower", src: "/stickers/sunflower.png", category: "Florals & Nature" },
  { id: "stk-redrose", name: "Velvet Red Rose", src: "/stickers/redrose.png", category: "Florals & Nature" },
  { id: "stk-butterfly", name: "Monarch Butterfly", src: "/stickers/butterfly.png", category: "Florals & Nature" },
  { id: "stk-goldenbutterfly", name: "Gilded Butterfly", src: "/stickers/goldenbutterfly.png", category: "Florals & Nature" },

  // Love & Romance (from src/stickers)
  { id: "stk-bow", name: "Coquette Bow", src: "/stickers/bow.png", category: "Love & Romance" },
  { id: "stk-kiss", name: "Lipstick Kiss", src: "/stickers/kiss.png", category: "Love & Romance" },
  { id: "stk-thumbheart", name: "Finger Heart", src: "/stickers/thumbheart.png", category: "Love & Romance" },

  // Seals & Wax (from src/stickers)
  { id: "stk-s13", name: "Wax Seal 13", src: "/stickers/s13.png", category: "Seals & Stamps" },
  { id: "stk-s14", name: "Wax Seal 14", src: "/stickers/s14.png", category: "Seals & Stamps" },
  { id: "stk-s15", name: "Wax Seal 15", src: "/stickers/s15.png", category: "Seals & Stamps" },
  { id: "stk-s16", name: "Wax Seal 16", src: "/stickers/s16.png", category: "Seals & Stamps" },
  { id: "stk-s17", name: "Wax Seal 17", src: "/stickers/s17.png", category: "Seals & Stamps" },
  { id: "stk-s18", name: "Wax Seal 18", src: "/stickers/s18.png", category: "Seals & Stamps" },

  // Vintage Postage Stamps (from src/stickers)
  { id: "stk-st1", name: "Vintage Stamp 01", src: "/stickers/st1.png", category: "Seals & Stamps" },
  { id: "stk-st2", name: "Postage Stamp 02", src: "/stickers/st2.jpg", category: "Seals & Stamps" },
  { id: "stk-st3", name: "Airmail Stamp 03", src: "/stickers/st3.png", category: "Seals & Stamps" },
  { id: "stk-st4", name: "Postage Stamp 04", src: "/stickers/st4.png", category: "Seals & Stamps" },
  { id: "stk-st5", name: "Vintage Stamp 05", src: "/stickers/st5.png", category: "Seals & Stamps" },
  { id: "stk-st6", name: "Postal Stamp 06", src: "/stickers/st6.png", category: "Seals & Stamps" },
  { id: "stk-st7", name: "Vintage Stamp 07", src: "/stickers/st7.png", category: "Seals & Stamps" },
  { id: "stk-st8", name: "Heritage Stamp 08", src: "/stickers/st8.png", category: "Seals & Stamps" },
  { id: "stk-st9", name: "Classic Stamp 09", src: "/stickers/st9.png", category: "Seals & Stamps" },
  { id: "stk-st10", name: "Airmail Stamp 10", src: "/stickers/st10.png", category: "Seals & Stamps" },
  { id: "stk-st11", name: "Vintage Stamp 11", src: "/stickers/st11.png", category: "Seals & Stamps" },
  { id: "stk-st12", name: "Postage Stamp 12", src: "/stickers/st12.png", category: "Seals & Stamps" },

  // Stars & Sparkles (from src/stickers)
  { id: "stk-goldenstar", name: "Golden Star", src: "/stickers/goldenstar.png", category: "Stars & Sparkles" },
  { id: "stk-goldenstars", name: "Star Cluster", src: "/stickers/goldenstars.png", category: "Stars & Sparkles" },
  { id: "stk-redstar", name: "Ruby Star", src: "/stickers/redstar.png", category: "Stars & Sparkles" },
  { id: "stk-redstardoodle", name: "Doodle Star", src: "/stickers/redstardoodle.png", category: "Stars & Sparkles" },

  // Cute Keepsakes & Retro (from src/stickers)
  { id: "stk-vinyl", name: "Vinyl Record", src: "/stickers/vinyl.png", category: "Cute Scrapbook" },
  { id: "stk-sticker1", name: "Scrapbook Charm", src: "/stickers/sticker1.png", category: "Cute Scrapbook" },

  // Additional elements
  { id: "element-tape", name: "Washi Tape Strip", src: "/elements/tape.png", category: "Craft & Clips" },
  { id: "element-tape2", name: "Craft Tape Piece", src: "/elements/tape2.png", category: "Craft & Clips" },
  { id: "element-note1", name: "Note Paper Clip", src: "/elements/note1.png", category: "Craft & Clips" },
  { id: "element-lovetape", name: "Love Washi Tape", src: "/elements/lovetape.png", category: "Love & Romance" },
  { id: "element-ted", name: "Vintage Teddy Bear", src: "/elements/ted.png", category: "Cute Scrapbook" },
  { id: "element-cam", name: "Retro Camera", src: "/elements/cam.png", category: "Cute Scrapbook" },
  { id: "element-recorder", name: "Retro Cassette", src: "/elements/recorder.png", category: "Cute Scrapbook" },
  { id: "element-disk", name: "Vintage Disk", src: "/elements/disk.png", category: "Cute Scrapbook" },
];


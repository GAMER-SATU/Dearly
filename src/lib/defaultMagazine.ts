import { MagazineData } from "@/types/magazine";

export const defaultMagazineData: MagazineData = {
  id: "dearly-sample-01",
  title: "A Little Book of Us",
  createdAt: "2026-09-28",
  expiresAt: "2026-10-28",
  frontCover: {
    title: "DEARLY",
    subtitle: "A Little Book of Us • Volume I",
    issueDate: "Autumn • 2026",
    dedication: "For Maya, with all the love my heart can carry",
    accentColor: "#54141d",
    sticker: "/assets/stickers/wax-seal.svg",
  },
  memoryPage: {
    chapterTitle: "Chapter 01",
    headline: "The Coffee Shop on Bleecker St.",
    dateBadge: "October 14th, 2024",
    locationStamp: "NEW YORK • 40.7306° N",
    introText:
      "A sudden afternoon rainstorm caught us by surprise. We hurried under that tiny canvas awning, ordered warm cappuccinos, and spoke for hours.",
    featuredPhotoUrl:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    featuredPhotoCaption: "The day we talked until closing time.",
    secondPhotoUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    secondPhotoCaption: "Lukewarm cups & autumn rain.",
    bodyLetter:
      "Do you remember how the streetlamps began to flicker on outside? I knew right then that ordinary days with you would always feel like poetry.",
    sticker: "/assets/stickers/postage-stamp.svg",
  },
  polaroidCollage: {
    title: "Unscripted Snapshots",
    note: "Tucked inside my pocket, preserved forever.",
    polaroids: [
      {
        id: "p1",
        imageUrl:
          "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80",
        caption: "Sunset at Montauk Pier",
        rotation: -2,
      },
      {
        id: "p2",
        imageUrl:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80",
        caption: "Laughing at inside jokes",
        rotation: 3,
      },
      {
        id: "p3",
        imageUrl:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=80",
        caption: "Golden hour in botanical garden",
        rotation: -1.5,
      },
    ],
    sticker: "/assets/stickers/paper-clip.svg",
  },
  aboutUs: {
    title: "Our Story in Chapters",
    subtitle: "Two souls, one serendipitous journey",
    mainImageUrl:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    storyQuote:
      "“Whatever our souls are made of, his and mine are the same.”",
    storyParagraph:
      "We started with a simple hello and a shared warm cappuccino, having no idea our paths were about to intertwine so deeply. Every laugh, every late-night walk, and every quiet understanding since that day has built a story I will treasure forever.\n\nHere's to our chapters yet unwritten—full of warm light, gentle adventures, and a love that grows sweeter with every passing day.",
    milestones: [
      { date: "Oct 2024", event: "First rainy coffee & 3-hour conversation" },
      { date: "Dec 2024", event: "Ice skating under the Rockefeller tree" },
      { date: "Jul 2025", event: "Spontaneous coastal road trip" },
      { date: "Today", event: "Still falling for your smile every morning" },
    ],
    handwrittenNote: "P.S. You still owe me a rematch in Scrabble!",
    sticker: "/assets/stickers/flower-dried.svg",
  },
  backCover: {
    closingQuote:
      "Some memories are meant to be kept gently, like flowers pressed between favorite pages.",
    signature: "Always yours,\nJulian",
    editionText: "Temporary Digital Edition • Handcrafted with Dearly",
    secretMessage: "I love you more than all the stars in the night sky.",
    waxSealColor: "#9e2a2b",
    sticker: "/assets/stickers/wax-seal.svg",
  },
  placedStickers: [
    {
      id: "init-sticker-1",
      pageIndex: 1,
      src: "/elements/rosel.png",
      name: "Single Red Rose",
      x: 78,
      y: 84,
      rotation: 12,
      scale: 1,
    },
    {
      id: "init-sticker-2",
      pageIndex: 2,
      src: "/elements/lovetape.png",
      name: "Love Washi Tape",
      x: 82,
      y: 20,
      rotation: -5,
      scale: 1,
    },
    {
      id: "init-sticker-3",
      pageIndex: 4,
      src: "/elements/rabbit.png",
      name: "Vintage Bunny",
      x: 50,
      y: 70,
      rotation: 0,
      scale: 1.1,
    },
  ],
  placedTexts: [],
};


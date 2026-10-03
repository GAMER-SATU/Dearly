import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function categorize(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.startsWith("bq") || lower.includes("flower") || lower.includes("rose") || lower.includes("sunflower") || lower.includes("butterfly")) {
    return "Florals & Nature";
  }
  if (lower.includes("star") || lower.includes("golden") || lower.includes("sparkle")) {
    return "Stars & Sparkles";
  }
  if (lower.includes("heart") || lower.includes("kiss") || lower.includes("bow") || lower.includes("love")) {
    return "Love & Romance";
  }
  if (lower.startsWith("st") || lower.startsWith("s1") || lower.includes("stamp") || lower.includes("seal")) {
    return "Seals & Stamps";
  }
  return "Cute Scrapbook";
}

function formatName(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  const lower = nameWithoutExt.toLowerCase();

  const specialNames: Record<string, string> = {
    bow: "Coquette Bow",
    kiss: "Lipstick Kiss",
    thumbheart: "Finger Heart",
    sunflower: "Sunny Sunflower",
    redrose: "Velvet Red Rose",
    flowerbouquet: "Wildflower Bouquet",
    butterfly: "Monarch Butterfly",
    goldenbutterfly: "Gilded Butterfly",
    goldenstar: "Golden Star",
    goldenstars: "Star Cluster",
    redstar: "Ruby Star",
    redstardoodle: "Doodle Star",
    vinyl: "Vinyl Record",
    sticker1: "Scrapbook Charm",
  };

  if (specialNames[lower]) {
    return specialNames[lower];
  }

  const bqMatch = lower.match(/^bq(\d+)$/);
  if (bqMatch) {
    return `Bouquet ${bqMatch[1]}`;
  }

  const stMatch = lower.match(/^st(\d+)$/);
  if (stMatch) {
    return `Vintage Stamp ${stMatch[1].padStart(2, "0")}`;
  }

  const sMatch = lower.match(/^s(\d+)$/);
  if (sMatch) {
    return `Wax Seal ${sMatch[1]}`;
  }

  const formatted = nameWithoutExt
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export async function GET() {
  try {
    const stickersDir = path.join(process.cwd(), "src", "stickers");
    if (!fs.existsSync(stickersDir)) {
      return NextResponse.json({ stickers: [] });
    }

    const files = await fs.promises.readdir(stickersDir);
    const validImageExtensions = [".png", ".jpg", ".jpeg", ".svg", ".webp"];

    const stickers = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return validImageExtensions.includes(ext) && file !== "s18'.png";
      })
      .map((file) => {
        const id = file.replace(/[^a-zA-Z0-9_-]/g, "_");
        return {
          id: `src-sticker-${id}`,
          name: formatName(file),
          // We can serve via /stickers/<file> (since copied to public) or /api/stickers/<file>
          src: `/stickers/${file}`,
          category: categorize(file),
        };
      });

    return NextResponse.json({ stickers });
  } catch (error) {
    console.error("Error loading stickers:", error);
    return NextResponse.json({ stickers: [] }, { status: 500 });
  }
}

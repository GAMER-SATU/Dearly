import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MagazineData } from "@/types/magazine";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const magazine: MagazineData = body.magazine;

    if (!magazine) {
      return NextResponse.json(
        { error: "Missing magazine payload" },
        { status: 400 }
      );
    }

    const id = `m_${Math.random().toString(36).substring(2, 8)}${Date.now().toString(36).substring(4, 7)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const createdAt = now.toISOString();

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to Supabase table
    const { error } = await supabase.from("magazines").insert({
      id,
      title: magazine.frontCover?.title || "Dearly Keepsake",
      data: magazine,
      image_paths: [],
      created_at: createdAt,
      expires_at: expiresAt,
    });

    if (error) {
      console.warn("API Supabase insert notice:", error.message);
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const url = `${protocol}://${host}/m/${id}`;

    return NextResponse.json({
      success: true,
      id,
      url,
      expiresAt,
      createdAt,
    });
  } catch (err: any) {
    console.error("Share API error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

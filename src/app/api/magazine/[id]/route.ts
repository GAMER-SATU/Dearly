import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: record, error } = await supabase
      .from("magazines")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !record) {
      return NextResponse.json(
        { error: "Magazine not found or already deleted", isExpired: true },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(record.expires_at);

    // If 24 hours have elapsed: delete and return expired
    if (now.getTime() >= expiresAt.getTime()) {
      // 1. Delete associated images from storage
      if (record.image_paths && record.image_paths.length > 0) {
        await supabase.storage.from("magazines").remove(record.image_paths);
      }
      // 2. Delete row from database
      await supabase.from("magazines").delete().eq("id", id);

      return NextResponse.json(
        {
          error: "This 24-hour memory link has expired and was permanently deleted.",
          isExpired: true,
        },
        { status: 410 }
      );
    }

    return NextResponse.json({
      data: record.data,
      expiresAt: record.expires_at,
      createdAt: record.created_at,
      isExpired: false,
      timeRemainingMs: expiresAt.getTime() - now.getTime(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch magazine" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find and delete images
    const { data: record } = await supabase
      .from("magazines")
      .select("image_paths")
      .eq("id", id)
      .maybeSingle();

    if (record?.image_paths?.length) {
      await supabase.storage.from("magazines").remove(record.image_paths);
    }

    await supabase.from("magazines").delete().eq("id", id);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete" },
      { status: 500 }
    );
  }
}

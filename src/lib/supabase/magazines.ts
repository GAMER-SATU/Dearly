import { createClient } from "@/utils/supabase/client";
import { MagazineData } from "@/types/magazine";

export interface ShareResult {
  id: string;
  url: string;
  expiresAt: string;
  createdAt: string;
}

export interface FetchMagazineResult {
  data: MagazineData | null;
  expiresAt: string | null;
  createdAt: string | null;
  isExpired: boolean;
  timeRemainingMs?: number;
}

/**
 * Uploads a base64 data-url image to Supabase Storage 'magazines' bucket
 */
async function uploadBase64Image(
  supabase: ReturnType<typeof createClient>,
  base64Data: string,
  filePath: string
): Promise<string | null> {
  try {
    if (!base64Data.startsWith("data:image/")) return null;

    const parts = base64Data.split(",");
    if (parts.length < 2) return null;

    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mime });

    const { error: uploadErr } = await supabase.storage
      .from("magazines")
      .upload(filePath, blob, {
        contentType: mime,
        upsert: true,
      });

    if (uploadErr) {
      console.warn("Could not upload image to Supabase storage:", uploadErr.message);
      return null;
    }

    const { data } = supabase.storage.from("magazines").getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (err) {
    console.warn("Error processing image upload:", err);
    return null;
  }
}

/**
 * Creates a 24-hour temporary shareable memory link and uploads user images
 */
export async function createShareableMagazine(
  magazine: MagazineData
): Promise<ShareResult> {
  const supabase = createClient();

  // Generate unique short ID (e.g. m_k8d2x9)
  const id = `m_${Math.random().toString(36).substring(2, 8)}${Date.now().toString(36).substring(4, 7)}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const createdAt = now.toISOString();

  const imagePaths: string[] = [];

  // Deep clone magazine data so we can replace base64 photos with storage URLs if available
  const cleanedData: MagazineData = JSON.parse(JSON.stringify(magazine));

  try {
    // 1. Memory page featured photo
    if (cleanedData.memoryPage?.featuredPhotoUrl?.startsWith("data:image/")) {
      const path = `${id}/memory-1.jpg`;
      const url = await uploadBase64Image(supabase, cleanedData.memoryPage.featuredPhotoUrl, path);
      if (url) {
        cleanedData.memoryPage.featuredPhotoUrl = url;
        imagePaths.push(path);
      }
    }

    // 2. Memory page second photo
    if (cleanedData.memoryPage?.secondPhotoUrl?.startsWith("data:image/")) {
      const path = `${id}/memory-2.jpg`;
      const url = await uploadBase64Image(supabase, cleanedData.memoryPage.secondPhotoUrl, path);
      if (url) {
        cleanedData.memoryPage.secondPhotoUrl = url;
        imagePaths.push(path);
      }
    }

    // 3. About Us main photo
    if (cleanedData.aboutUs?.mainImageUrl?.startsWith("data:image/")) {
      const path = `${id}/about-main.jpg`;
      const url = await uploadBase64Image(supabase, cleanedData.aboutUs.mainImageUrl, path);
      if (url) {
        cleanedData.aboutUs.mainImageUrl = url;
        imagePaths.push(path);
      }
    }

    // 4. Polaroid strip photos
    if (cleanedData.polaroidCollage?.polaroids) {
      for (let i = 0; i < cleanedData.polaroidCollage.polaroids.length; i++) {
        const p = cleanedData.polaroidCollage.polaroids[i];
        if (p?.imageUrl?.startsWith("data:image/")) {
          const path = `${id}/polaroid-${i}.jpg`;
          const url = await uploadBase64Image(supabase, p.imageUrl, path);
          if (url) {
            p.imageUrl = url;
            imagePaths.push(path);
          }
        }
      }
    }

    // 5. Placed photos (freeform)
    if (cleanedData.placedImages) {
      for (let i = 0; i < cleanedData.placedImages.length; i++) {
        const img = cleanedData.placedImages[i];
        if (img?.src?.startsWith("data:image/")) {
          const path = `${id}/placed-${i}.jpg`;
          const url = await uploadBase64Image(supabase, img.src, path);
          if (url) {
            img.src = url;
            imagePaths.push(path);
          }
        }
      }
    }
  } catch (err) {
    console.warn("Storage upload step encountered an issue; falling back to embedded data:", err);
  }

  // Insert into Supabase table
  try {
    const { error: insertErr } = await supabase.from("magazines").insert({
      id,
      title: cleanedData.frontCover?.title || "Dearly Keepsake",
      data: cleanedData,
      image_paths: imagePaths,
      created_at: createdAt,
      expires_at: expiresAt,
    });

    if (insertErr) {
      console.warn("Supabase table insert error:", insertErr.message);
    }
  } catch (err) {
    console.warn("Supabase insert failed:", err);
  }

  // Also save to localStorage as a client-side offline/instant fallback
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `dearly_share_${id}`,
        JSON.stringify({
          data: cleanedData,
          createdAt,
          expiresAt,
          imagePaths,
        })
      );
    } catch {
      // ignore quota errors
    }
  }

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://dearly.memory";

  return {
    id,
    url: `${origin}/m/${id}`,
    expiresAt,
    createdAt,
  };
}

/**
 * Fetches a shared magazine by ID and strictly enforces 24-hour expiration
 */
export async function getShareableMagazine(
  id: string
): Promise<FetchMagazineResult> {
  const supabase = createClient();
  const now = new Date();

  // 1. Try querying Supabase
  try {
    const { data: record, error } = await supabase
      .from("magazines")
      .select("id, data, expires_at, created_at, image_paths")
      .eq("id", id)
      .maybeSingle();

    if (!error && record) {
      const expiresAtDate = new Date(record.expires_at);
      const isExpired = now.getTime() >= expiresAtDate.getTime();

      if (isExpired) {
        // Automatically delete from storage and database upon expiration
        await deleteExpiredMagazine(id, record.image_paths);
        return {
          data: null,
          expiresAt: record.expires_at,
          createdAt: record.created_at,
          isExpired: true,
          timeRemainingMs: 0,
        };
      }

      return {
        data: record.data as MagazineData,
        expiresAt: record.expires_at,
        createdAt: record.created_at,
        isExpired: false,
        timeRemainingMs: Math.max(0, expiresAtDate.getTime() - now.getTime()),
      };
    }
  } catch (err) {
    console.warn("Supabase fetch error:", err);
  }

  // 2. Check localStorage fallback
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(`dearly_share_${id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        const expiresAtDate = new Date(parsed.expiresAt);
        const isExpired = now.getTime() >= expiresAtDate.getTime();

        if (isExpired) {
          localStorage.removeItem(`dearly_share_${id}`);
          return {
            data: null,
            expiresAt: parsed.expiresAt,
            createdAt: parsed.createdAt,
            isExpired: true,
            timeRemainingMs: 0,
          };
        }

        return {
          data: parsed.data as MagazineData,
          expiresAt: parsed.expiresAt,
          createdAt: parsed.createdAt,
          isExpired: false,
          timeRemainingMs: Math.max(0, expiresAtDate.getTime() - now.getTime()),
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    data: null,
    expiresAt: null,
    createdAt: null,
    isExpired: true,
    timeRemainingMs: 0,
  };
}

/**
 * Permanently deletes an expired magazine and its images from Supabase Storage
 */
export async function deleteExpiredMagazine(
  id: string,
  imagePaths?: string[]
): Promise<void> {
  const supabase = createClient();

  try {
    // 1. Delete images from storage bucket
    if (imagePaths && imagePaths.length > 0) {
      await supabase.storage.from("magazines").remove(imagePaths);
    } else {
      // Try listing and deleting folder
      const { data: files } = await supabase.storage.from("magazines").list(id);
      if (files && files.length > 0) {
        const paths = files.map((f) => `${id}/${f.name}`);
        await supabase.storage.from("magazines").remove(paths);
      }
    }

    // 2. Delete database row
    await supabase.from("magazines").delete().eq("id", id);
  } catch (err) {
    console.warn("Error deleting expired magazine files:", err);
  }

  // Clean local fallback
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`dearly_share_${id}`);
    } catch {
      // ignore
    }
  }
}

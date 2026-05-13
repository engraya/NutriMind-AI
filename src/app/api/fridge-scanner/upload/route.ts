import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    const result = await uploadToCloudinary(file, { folder: "nutrimind/fridge-scans" });

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}

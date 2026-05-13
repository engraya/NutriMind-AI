import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeFridgeImage } from "@/lib/gemini/fridge-scanner";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, cloudinaryId } = await request.json();
  if (!imageUrl || !cloudinaryId) {
    return NextResponse.json({ error: "imageUrl and cloudinaryId are required" }, { status: 400 });
  }

  try {
    const scanResult = await analyzeFridgeImage(imageUrl);

    const { data: scan, error } = await supabase
      .from("fridge_scans")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        cloudinary_id: cloudinaryId,
        detected_ingredients: scanResult.detected_ingredients,
        suggested_meals: scanResult.suggested_meals,
        nutrition_info: scanResult.suggested_meals[0]?.estimated_nutrition ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Scan save error:", error);
    }

    return NextResponse.json({
      success: true,
      detectedIngredients: scanResult.detected_ingredients,
      suggestedMeals: scanResult.suggested_meals,
      nutritionalNote: scanResult.nutritional_note,
      scanId: scan?.id,
    });
  } catch (error) {
    console.error("Fridge scan analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze image. Please try again." }, { status: 500 });
  }
}

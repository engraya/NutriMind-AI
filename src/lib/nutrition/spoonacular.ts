const BASE_URL = "https://api.spoonacular.com";

interface SpoonacularSearchResult {
  id: number;
  title: string;
  image: string;
}

export async function searchRecipeImage(
  recipeName: string
): Promise<string | null> {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(
      recipeName
    )}&number=1&apiKey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const results: SpoonacularSearchResult[] = data.results ?? [];
    return results[0]?.image ?? null;
  } catch {
    return null;
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

type Recommendation = {
  type: string;
  id: number;
  title: string;
  goal: string;
};

type Reference = {
  label: string;
  href: string;
  badge?: string;
};

const buildHref = (item: { type: string; id: number }) =>
  item.type === "meal_plan" ? `/meal-plans/${item.id}` : `/${item.type}s/${item.id}`;

async function fetchWithCookies(path: string) {
  return fetch(`${API_BASE}${path}`, {
    headers: {
      cookie: cookies().toString(),
    },
  });
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const question = (payload?.question ?? "").trim();

  if (!question) {
    return NextResponse.json(
      { error: "Please share a question or topic." },
      { status: 400 }
    );
  }

  let recommendations: Recommendation[] = [];
  let searchResults: Record<string, any[]> = {};

  try {
    const recRes = await fetchWithCookies("/api/recommendations/");
    if (recRes.ok) {
      recommendations = (await recRes.json()) ?? [];
    }
  } catch (error) {
    console.error("recommendations fetch failed", error);
  }

  try {
    const searchRes = await fetchWithCookies(
      `/api/search/?q=${encodeURIComponent(question)}`
    );
    if (searchRes.ok) {
      searchResults = (await searchRes.json()) ?? {};
    }
  } catch (error) {
    console.error("search fetch failed", error);
  }

  const references: Reference[] = [];
  const trimmedQuestion = question.toLowerCase();

  if (recommendations.length) {
    references.push(
      ...recommendations.slice(0, 3).map((item) => ({
        label: `${item.title} (${item.type})`,
        href: buildHref(item),
        badge: "Recommended",
      }))
    );
  }

  const mapping: Record<string, string> = {
    ingredient: "/ingredients",
    recipe: "/recipes",
    product: "/products",
    meal_plan: "/meal-plans",
  };

  Object.entries(mapping).forEach(([key, base]) => {
    const list = searchResults[`${key}s`];
    if (trimmedQuestion.includes(key) && list?.length) {
      const candidate = list[0];
      references.push({
        label: `${candidate.title ?? candidate.name} (${key})`,
        href: `${base}/${candidate.id}`,
        badge: "Found",
      });
    }
  });

  let answer =
    "I can chat about nutrition, ingredients, beauty, and wellness. Ask for recipes, products, or skin/hair tips.";

  if (trimmedQuestion.includes("recipe") || trimmedQuestion.includes("meal")) {
    answer =
      `Meal ideas to try: ${
        references.length ? references.map((ref) => ref.label).join(", ") : "Browse the recipes page."
      }`;
  } else if (
    trimmedQuestion.includes("ingredient") ||
    trimmedQuestion.includes("foods") ||
    trimmedQuestion.includes("nutrition")
  ) {
    answer = references.length
      ? `A great ingredient to start with is ${references[0].label}.`
      : "Check the ingredients page for healthy foods and benefits.";
  } else if (trimmedQuestion.includes("skin") || trimmedQuestion.includes("beauty")) {
    answer =
      `Glow tips: ${
        references.length ? references.map((ref) => ref.label).join(", ") : "Check ingredients and recipes for skin-supporting nutrients."
      }`;
  } else if (recommendations.length) {
    answer = `Based on your activity, I'd highlight ${recommendations[0].title}. Ask for more detail if you want.`;
  }

  if (!references.length && searchResults.recipes?.length) {
    references.push({
      label: `${searchResults.recipes[0].title} (recipe)`,
      href: `/recipes/${searchResults.recipes[0].id}`,
    });
  }

  return NextResponse.json({ answer, references });
}

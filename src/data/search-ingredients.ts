import { Ingredient } from "./models";

export const searchIngredients = (
  allIngredients: Ingredient[],
  query: string
): { matching: Ingredient[]; fullMatch: boolean } => {
  if (!query) return { matching: allIngredients, fullMatch: false };

  const normalizedQuery = query.trim().toLowerCase();

  const matching: Ingredient[] = [];
  let fullMatch = false;
  for (const ingredient of allIngredients) {
    if (ingredient.name.toLowerCase().includes(normalizedQuery)) {
      matching.push(ingredient);
    }
    if (ingredient.name.toLowerCase().trim() === normalizedQuery)
      fullMatch = true;
  }
  return { matching, fullMatch };
};

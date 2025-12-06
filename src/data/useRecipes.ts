import { RecipesListFilters } from "../features/recipes-list/useRecipesFilters";
import { recipesCollection } from "../firebase/firebase-references";
import { useRealtimeQuery } from "../firebase/queries/useRealtimeQuery";
import { useQueryTransform } from "../firebase/useQueryTransform";
import { Recipe } from "./models";

export const useRecipes = ({ categories, searchTerm }: RecipesListFilters) => {
  const query = useRealtimeQuery(recipesCollection());

  return useQueryTransform(
    query,
    (data) => {
      if (!searchTerm && (categories?.length ?? 0) < 1) return data;

      return data.filter(
        (x) =>
          matchesCategory(x, categories) && matchesSearchTerm(x, searchTerm)
      );
    },
    [searchTerm, categories]
  );
};

const matchesSearchTerm = (item: Recipe, searchTerm?: string) => {
  if (!searchTerm) return true;

  return item.name.toLowerCase().includes(searchTerm.toLowerCase());
};

const matchesCategory = (item: Recipe, categories?: string[]) => {
  if (!categories || categories.length === 0) return true;

  for (const categoryId of categories) {
    if (!item.categories.includes(categoryId)) return false;
  }
  return true;
};

import { RecipesListFilters } from "../features/recipes-list/RecipesListPage";
import { recipesCollection } from "../firebase/firebase-references";
import { useRealtimeQuery } from "../firebase/queries/useRealtimeQuery";
import { useQueryTransform } from "../firebase/useQueryTransform";
import { Recipe } from "./models";

export const useRecipes = ({ categoryId, searchTerm }: RecipesListFilters) => {
  const query = useRealtimeQuery(recipesCollection());

  return useQueryTransform(
    query,
    (data) => {
      if (!searchTerm && !categoryId) return data;

      return data.filter(
        (x) =>
          matchesCategory(x, categoryId) && matchesSearchTerm(x, searchTerm)
      );
    },
    [searchTerm, categoryId]
  );
};

const matchesSearchTerm = (item: Recipe, searchTerm?: string) => {
  if (!searchTerm) return true;

  return item.name.toLowerCase().includes(searchTerm.toLowerCase());
};

const matchesCategory = (item: Recipe, categoryId?: string) => {
  if (!categoryId) return true;

  return item.categories.includes(categoryId);
};

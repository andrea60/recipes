import { useNavigate, useSearch } from "@tanstack/react-router";

export type RecipesListFilters = {
  searchTerm?: string;
  categories?: string[];
};

export const useRecipesFilters = () => {
  const filters = useSearch({ from: "/recipes/" });
  const navigate = useNavigate();

  const updateFilters = (newFilters: Partial<RecipesListFilters>) => {
    navigate({
      to: ".",
      search: (c) => ({ ...c, ...newFilters }),
      replace: true,
    });
  };

  const resetFilters = () => {
    navigate({
      to: ".",
      search: {},
      replace: true,
    });
  };

  const hasCategoryFilter = filters.categories && filters.categories.length > 0;

  return {
    ...filters,
    hasFilters: hasCategoryFilter || !!filters.searchTerm,
    updateFilters,
    resetFilters,
  };
};

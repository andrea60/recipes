import { useNavigate, useSearch } from "@tanstack/react-router";

export type RecipesListFilters = {
  searchTerm?: string;
  categoryId?: string;
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

  return {
    ...filters,
    hasFilters: !!filters.categoryId || !!filters.searchTerm,
    updateFilters,
    resetFilters,
  };
};

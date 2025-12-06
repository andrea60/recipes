import { createFileRoute } from "@tanstack/react-router";
import { RecipesListPage } from "../../features/recipes-list/RecipesListPage";
import { RecipesListFilters } from "../../features/recipes-list/useRecipesFilters";

export const Route = createFileRoute("/recipes/")({
  component: RecipesListPage,
  beforeLoad: () => {
    return {
      pageTitle: "Recipes",
    };
  },
  validateSearch: (params) => {
    return params as RecipesListFilters;
  },
});

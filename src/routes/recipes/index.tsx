import { createFileRoute } from "@tanstack/react-router";
import {
  RecipesListFilters,
  RecipesListPage,
} from "../../features/recipes-list/RecipesListPage";

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

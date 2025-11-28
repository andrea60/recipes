import { createFileRoute } from "@tanstack/react-router";
import { RecipesListPage } from "../../features/recipes-list/RecipesListPage";
export const Route = createFileRoute("/recipes/")({
  component: RecipesListPage,
  beforeLoad: () => {
    return {
      pageTitle: "Recipes",
    };
  },
});

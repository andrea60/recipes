import { createFileRoute } from "@tanstack/react-router";
import { RecipeMode, RecipePage, RecipeView } from "../../pages/RecipePage";

type RecipeRouteSearchParams = {
  mode?: RecipeMode;
  view?: RecipeView;
};

export const Route = createFileRoute("/recipes/$id")({
  component: RecipePage,
  validateSearch: (search) =>
    ({
      mode: search.mode,
      view: search.view,
    }) as RecipeRouteSearchParams,
});

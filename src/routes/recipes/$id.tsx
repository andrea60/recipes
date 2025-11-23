import { createFileRoute } from "@tanstack/react-router";
import { RecipePage } from "../../pages/RecipePage";

export const Route = createFileRoute("/recipes/$id")({
  component: RecipePage,
});

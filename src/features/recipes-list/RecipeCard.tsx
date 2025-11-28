import { useNavigate } from "@tanstack/react-router";
import { Recipe } from "../../data/models";
import { RecipesImagePreview } from "./RecipeImagePreview";

type Props = {
  recipe: Recipe;
};
export const RecipeCard = ({ recipe }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className=""
      key={recipe.id}
      onClick={() =>
        navigate({
          to: "/recipes/$id",
          params: { id: recipe.id },
        })
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex-1">
          <RecipesImagePreview recipe={recipe} size={160} />
        </div>
        <div>
          <h1 className="text-xl text-left font-bold flex-1">{recipe.name}</h1>
          <p className="text-sm">Vegan</p>
        </div>
      </div>
    </div>
  );
};

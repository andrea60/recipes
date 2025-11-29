import { useNavigate } from "@tanstack/react-router";
import { Recipe } from "../../data/models";
import { RecipesImagePreview } from "./RecipeImagePreview";
import classNames from "classnames";

type Props = {
  recipe: Recipe;
  className?: string;
  aspectRatio: string;
};
export const RecipeCard = ({ recipe, className, aspectRatio }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames("w-full", className)}
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
          <RecipesImagePreview recipe={recipe} aspectRatio={aspectRatio} />
        </div>
        <div>
          <h1 className="text-lg text-left font-bold flex-1 overflow-ellipsis w-full whitespace-nowrap overflow-hidden">
            {recipe.name}
          </h1>
          <p className="text-sm">Vegan</p>
        </div>
      </div>
    </div>
  );
};

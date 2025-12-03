import { useNavigate } from "@tanstack/react-router";
import { Recipe } from "../../data/models";
import { RecipesImagePreview } from "./RecipeImagePreview";
import classNames from "classnames";
import { useToggleFavourite } from "../../data/useToggleFavourite";
import { HeartIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { vibrate } from "../../utils/vibrate";

type Props = {
  recipe: Recipe;
  className?: string;
  aspectRatio: string;
};
export const RecipeCard = ({ recipe, className, aspectRatio }: Props) => {
  const navigate = useNavigate();
  const toggleFavourite = useToggleFavourite();

  const onToggleFavourite = (evt: React.MouseEvent) => {
    toggleFavourite.execute(recipe.id, !recipe.isFavourite);
    evt.stopPropagation();
    vibrate();
  };
  return (
    <div className={classNames("w-full", className)} key={recipe.id}>
      <div className="flex flex-col gap-2">
        <div
          className="flex-1 relative"
          onClick={() =>
            navigate({
              to: "/recipes/$id",
              params: { id: recipe.id },
            })
          }
        >
          <div className="absolute top-0 w-full p-2 flex justify-end">
            <motion.button
              className="btn btn-circle glass-bg-3 btn-outline"
              disabled={toggleFavourite.inProgress}
              onClick={onToggleFavourite}
              whileTap={{ scale: 0.7 }}
            >
              <HeartIcon
                size={22}
                className={recipe.isFavourite ? "text-red-400" : "text-primary"}
                weight={recipe.isFavourite ? "fill" : "regular"}
              />
            </motion.button>
          </div>
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

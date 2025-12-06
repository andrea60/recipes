import classNames from "classnames";
import { Recipe } from "../../data/models";
import { RecipeCard } from "../../features/recipes-list/RecipeCard";
import { AnimatePresence } from "motion/react";

type Props = {
  elements: Recipe[];
};
export const MasonryGrid = ({ elements }: Props) => {
  const children = [];
  let idx = 0;
  for (const el of elements) {
    const isNewRow = idx % 2 === 0 && idx > 0;
    children.push(
      <RecipeCard
        key={el.id}
        recipe={el}
        className={classNames(isNewRow ? "-mt-12" : "row-span-1")}
        aspectRatio={idx == 0 ? "1 / 1 " : "1 / 1.3"}
      />
    );

    idx++;
  }
  return (
    <div className="grid grid-cols-2 gap-10">
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );
};

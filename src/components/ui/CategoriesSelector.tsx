import classNames from "classnames";
import { useCategories } from "../../data/Categories";
import { motion } from "motion/react";

type Props = {
  onChange: (ids: string[]) => void;
  selected: string[];
  className?: string;
};
export const CategoriesSelector = ({
  selected,
  onChange,
  className,
}: Props) => {
  const categories = useCategories();

  const onClick = (id: string, isSelected: boolean) => {
    if (!isSelected) {
      onChange([...selected, id]);
      return;
    }
    onChange(selected.filter((i) => i !== id));
  };
  return (
    <fieldset className={className}>
      <legend className="fieldset-legend">Categories</legend>
      <div className="bg-base-100 py-2 rounded-lg flex flex-row gap-4 flex-wrap">
        {categories.map((c) => {
          const isSelected = selected.includes(c.id);
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick(c.id, isSelected)}
              className={classNames(
                "badge badge-primary shadow-xs shadow-black/20",
                {
                  "badge-outline": !isSelected,
                }
              )}
            >
              {c.name}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
};

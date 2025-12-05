import { DotIcon } from "@phosphor-icons/react";
import { IngredientRef } from "../../data/models";

type Props = {
  ingredients: IngredientRef[];
  quantityMultiplier: number;
};

export const IngredientsList = ({ ingredients, quantityMultiplier }: Props) => {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Things you need</h1>
      <div className="transition-all">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0 items-center">
          {ingredients.map((i) => (
            <>
              <div key={i.id + "-qnt"} className="font-bold text-primary">
                <DotIcon className="inline mr-1" weight="fill" fontSize={18} />
                {i.quantity * quantityMultiplier} {i.unit}
              </div>
              <div key={i.id + "-name"}>{i.name}</div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

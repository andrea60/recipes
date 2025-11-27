import { BasketIcon, CaretDownIcon, DotIcon } from "@phosphor-icons/react";
import classNames from "classnames";
import { useState } from "react";
import { IngredientRef } from "../../data/models";

type Props = {
  ingredients: IngredientRef[];
  quantityMultiplier: number;
};

export const IngredientsList = ({ ingredients, quantityMultiplier }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="">
      <h1
        onClick={() => setOpen((x) => !x)}
        className="flex gap-2 items-center cursor-pointer font-bold text-xl mb-2"
      >
        <BasketIcon weight="fill" />
        Ingredients List
        <CaretDownIcon
          className={classNames("transition-transform", {
            "rotate-90": !open,
          })}
        />
      </h1>
      {open && (
        <div
          className={classNames("transition-all", open ? "min-h-fit" : "h-0")}
        >
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0 items-center">
            {ingredients.map((i) => (
              <>
                <div key={i.id + "-qnt"}>
                  <DotIcon
                    className="inline mr-1"
                    weight="fill"
                    fontSize={18}
                  />
                  {i.quantity * quantityMultiplier} {i.unit}
                </div>
                <div key={i.id + "-name"}>{i.name}</div>
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

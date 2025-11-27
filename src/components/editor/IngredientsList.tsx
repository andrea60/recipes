import { BasketIcon, CaretDownIcon } from "@phosphor-icons/react";
import classNames from "classnames";
import { useState } from "react";

export const IngredientsList = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="">
      <h1
        onClick={() => setOpen((x) => !x)}
        className="flex gap-2 items-center cursor-pointer font-bold text-lg"
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
          <ul>
            <li>asd</li>
            <li>asd</li>
            <li>asd</li>
          </ul>
        </div>
      )}
    </div>
  );
};

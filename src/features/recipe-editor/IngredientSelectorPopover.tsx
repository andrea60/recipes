import {
  getIngredientId,
  normalizeIngredientName,
} from "../../data/useKnownIngredients";
import { MentionNodeAttrs } from "@tiptap/extension-mention";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { IngredientRef } from "../../data/models";
import { searchIngredients } from "../../data/search-ingredients";
import { useEditorIngredients } from "./useEditorIngredients";
import { useResettableState } from "../../utils/useResettableState";
import classNames from "classnames";

export type IngredientsPopoverElement = {
  onKeyDown: (event: KeyboardEvent) => boolean;
};

type Props = {
  query: string;
  position: DOMRect;
  onSelected: (item: MentionNodeAttrs) => void;
};

type Option = {
  name: string;
  id: string;
};
const WIDTH = 200;

export const IngredientSelectorPopover = forwardRef<
  IngredientsPopoverElement,
  Props
>(({ query, position, onSelected }, ref) => {
  const ingredients = useEditorIngredients();
  const [selectedIdx, setSelectedIdx] = useResettableState(0, [query]);

  const mention = useMemo(() => parseMention(query), [query]);

  const searchResults = useMemo(
    () => searchIngredients(ingredients.data ?? [], mention?.name || ""),
    [ingredients, mention]
  );

  const options = useMemo(() => {
    const options: Option[] = [...searchResults.matching];
    if (!searchResults.fullMatch && mention)
      options.push({ name: mention.name, id: getIngredientId(mention.name) });
    return options;
  }, [searchResults]);

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: (event) => {
        if (event.key === "ArrowDown") {
          console.log(searchResults.matching.length);
          setSelectedIdx((x) => (x >= options.length - 1 ? x : x + 1));
          return true;
        } else if (event.key === "ArrowUp") {
          setSelectedIdx((x) => (x <= 0 ? x : x - 1));
          return true;
        } else if (event.key === "Enter") {
          const selected = options[selectedIdx];
          if (selected && mention) handleSelect({ ...mention, ...selected });
          return true;
        }

        return false;
      },
    }),
    [options]
  );

  const handleSelect = (ingredient: IngredientRef) => {
    console.log("Ingredient selected", ingredient);
    onSelected({
      ...ingredient,
      label: `${ingredient.quantity}${ingredient.unit} ${ingredient.name}`,
    });
  };

  let content = <p>Enter quantity and ingredient</p>;
  if (mention) {
    if (!ingredients.pending)
      content = (
        <>
          {options.map((i, idx) => (
            <button
              key={i.id}
              className={classNames("btn grow btn-sm", {
                "border-primary": idx === selectedIdx,
              })}
              onClick={() =>
                handleSelect({
                  ...i,
                  unit: mention.unit,
                  quantity: mention.quantity,
                })
              }
            >
              {mention.quantity} {mention.unit}{" "}
              <span className="font-bold">{i.name}</span>
            </button>
          ))}
        </>
      );
    else content = <div>Loading...</div>;
  }
  let posLeft = position.left;
  if (posLeft + WIDTH > window.screen.width) {
    // prevent overflowing
    posLeft = window.screen.width - WIDTH;
  }

  return (
    <div
      className="fixed bg-base-100 rounded-2xl shadow-md p-2 shadow-black/50"
      style={{
        left: posLeft,
        top: position.top + position.height,
        width: WIDTH,
      }}
    >
      <div className="card card-sm">
        <div className="card-body p-2">
          <div className="card-title text-xs border-primary/10 border-b pb-1">
            Use Ingredient
          </div>
          {content}
        </div>
      </div>
    </div>
  );
});

IngredientSelectorPopover.displayName = "IngredientSelectorPopover";

const parseMention = (text: string): IngredientRef | null => {
  if (!text || text.trim().length === 0) return null;
  const regex = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s+(.+)/i;

  const match = text.match(regex);
  if (!match) return null;

  const quantity = parseFloat(match[1]);
  const unit = match[2];
  const ingredientName = match[3];
  if (isNaN(quantity) || !unit || !ingredientName) return null;

  return {
    name: normalizeIngredientName(ingredientName),
    quantity,
    unit,
    id: getIngredientId(ingredientName),
  };
};

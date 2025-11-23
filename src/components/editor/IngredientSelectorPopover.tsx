import { atom, useAtom } from "jotai";
import {
  getIngredientId,
  normalizeIngredientName,
  useCreateIngredient,
  useKnownIngredients,
} from "../../data/useKnownIngredients";
import { MentionNodeAttrs } from "@tiptap/extension-mention";
import { useMemo } from "react";
import { IngredientRef } from "../../data/models";
import { searchIngredients } from "../../data/search-ingredients";
import { useEditorIngredients } from "./useEditorIngredients";

type ClosedMentionState = {
  isOpen: false;
};
type OpenedMentionState = {
  isOpen: true;
  positon?: DOMRect;
  query: string;
  onSelected?: (item: MentionNodeAttrs) => void;
};

type MentionState = OpenedMentionState | ClosedMentionState;

export const mentionsAtom = atom<MentionState>({ isOpen: false });

export const IngredientSelectorPopover = () => {
  const [mentionsState] = useAtom(mentionsAtom);
  const ingredients = useEditorIngredients();

  const mention = mentionsState.isOpen
    ? parseMention(mentionsState.query)
    : null;

  const searchResults = useMemo(
    () => searchIngredients(ingredients.data ?? [], mention?.name || ""),
    [ingredients, mentionsState]
  );

  if (!mentionsState.isOpen || !mentionsState.positon) return null;

  const handleSelect = (ingredient: IngredientRef) => {
    mentionsState.onSelected?.({
      ...ingredient,
      label: `${ingredient.quantity}${ingredient.unit} ${ingredient.name}`,
    });
  };

  let content = <p>Enter quantity and ingredient</p>;
  if (mention) {
    if (!ingredients.pending)
      content = (
        <>
          {searchResults.matching.map((i) => (
            <button
              className="btn btn-ghost grow"
              onClick={() =>
                handleSelect({
                  ...i,
                  unit: mention.unit,
                  quantity: mention.quantity,
                })
              }
            >
              {mention.quantity}
              {mention.unit} {i.name}
            </button>
          ))}
          {!searchResults.fullMatch && (
            <button
              className="btn btn-ghost grow"
              onClick={() => handleSelect(mention)}
            >
              {mention.quantity}
              {mention.unit} {mention.name} (new)
            </button>
          )}
        </>
      );
    else content = <div>Loading...</div>;
  }

  return (
    <div
      className="absolute bg-base-100 rounded-2xl shadow-md p-2 flex flex-col"
      style={{
        left: mentionsState.positon.left + mentionsState.positon.width,
        top: mentionsState.positon.top + mentionsState.positon.height,
      }}
    >
      {content}
    </div>
  );
};

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

import { useAtom } from "jotai";
import { useKnownIngredients } from "../../data/useKnownIngredients";
import { localIngredientsAtom } from "./RecipeEditor";
import { Ingredient } from "../../data/models";
import { useQueryTransform } from "../../firebase/useQueryTransform";

export const useEditorIngredients = () => {
  const knownIngredientsQuery = useKnownIngredients();
  const [localIngredients] = useAtom(localIngredientsAtom);

  return useQueryTransform(
    knownIngredientsQuery,
    (knownIngredients) => {
      const set: { [key: string]: Ingredient } = {};

      for (const ingredient of [...knownIngredients, ...localIngredients]) {
        set[ingredient.id] = ingredient;
      }

      return Object.values(set);
    },
    [localIngredients]
  );
};

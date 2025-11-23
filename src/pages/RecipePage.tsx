import { RecipeEditor } from "../components/editor/RecipeEditor";
import { Provider } from "jotai";
import { useCallback, useState } from "react";
import { ChefHatIcon, PencilIcon } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import { RecipeNameEditor } from "../components/editor/RecipeNameEditor";
import { useEditRecipe, useRecipe } from "../data/useRecipe";
import { IngredientRef, Recipe } from "../data/models";
import debounce from "lodash.debounce";
import { useResettableState } from "../utils/useResettableState";

type Mode = "edit" | "cook";

export const RecipePage = () => {
  const { id } = useParams({ from: "/recipes/$id" });
  const recipeDoc = useRecipe(id);

  if (recipeDoc.pending) return <div>Loading</div>;
  if (!recipeDoc.found) return <div>Not found</div>;

  return <RecipePageContent recipe={recipeDoc.data} startingMode="cook" />;
};

type Props = {
  startingMode: Mode;
  recipe: Recipe;
};
const RecipePageContent = ({ recipe: initialValue, startingMode }: Props) => {
  const [recipe, setRecipe] = useResettableState(
    () => initialValue,
    [initialValue]
  );
  const [mode, setMode] = useState<Mode>(startingMode);
  const { rename, updateContent } = useEditRecipe(recipe.id);

  const toggleMode = () => {
    setMode((m) => (m === "edit" ? "cook" : "edit"));
  };

  const handleRename = useCallback(
    debounce((newName: string) => {
      console.log("Renaming recipe to ", newName);
      rename.execute(newName);
      setRecipe((c) => ({ ...c, name: newName }));
    }, 500),
    [rename]
  );

  const handleContentChanged = useCallback(
    debounce((content: string, ingredients: IngredientRef[]) => {
      console.log("Updating recipe: ", content, ingredients);

      updateContent.execute(content, ingredients);

      setRecipe((c) => ({ ...c, content, ingredients }));
    }, 1000),
    [updateContent]
  );

  return (
    <Provider>
      <div className="flex flex-row border-b border-b-base-100 pb-3 mb-3">
        <RecipeNameEditor
          name={recipe.name}
          onChange={handleRename}
          readonly={mode === "cook"}
        />
        <label className="toggle text-base-content toggle-xl">
          <input
            type="checkbox"
            onChange={toggleMode}
            checked={mode === "edit"}
          />
          <ChefHatIcon aria-label="disabled" size="inherit" weight="fill" />
          <PencilIcon aria-label="enabled" size="inherit" weight="fill" />
        </label>
      </div>

      <RecipeEditor
        initialContent={recipe.content}
        onChange={handleContentChanged}
        readonly={mode === "cook"}
      />
    </Provider>
  );
};

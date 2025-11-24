import { RecipeEditor } from "../components/editor/RecipeEditor";
import { Provider } from "jotai";
import { useCallback, useState } from "react";
import {
  ArrowLeftIcon,
  ChefHatIcon,
  GearSixIcon,
  PencilIcon,
} from "@phosphor-icons/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { RecipeNameEditor } from "../components/editor/RecipeNameEditor";
import { IngredientRef, Recipe } from "../data/models";
import debounce from "lodash.debounce";
import { useModal } from "../components/modal/useModal";
import { EditRecipeModal } from "../components/editor/EditRecipeModal";
import { useEditableRecipe } from "../data/useEditableRecipe";
import { FileDef } from "../data/useCreateRecipe";

type Mode = "edit" | "cook";

export const RecipePage = () => {
  const { id } = useParams({ from: "/recipes/$id" });
  const recipeDoc = useEditableRecipe(id);

  if (recipeDoc.pending) return <div>Loading</div>;
  if (!recipeDoc.found) return <div>Not found</div>;

  return (
    <RecipePageContent
      recipe={recipeDoc.data}
      startingMode="cook"
      onChange={recipeDoc.updateAction.execute}
    />
  );
};

type Props = {
  startingMode: Mode;
  recipe: Recipe;
  onChange: (update: Partial<Recipe>, image?: FileDef) => void;
};
const RecipePageContent = ({ recipe, startingMode, onChange }: Props) => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const [mode, setMode] = useState<Mode>(startingMode);

  const toggleMode = () => {
    setMode((m) => (m === "edit" ? "cook" : "edit"));
  };

  const openSettings = () => {
    openModal({
      title: "Update Recipe",
      component: EditRecipeModal,
      componentProps: recipe,
      mode: "dialog",
    });
  };

  const handleRename = useCallback(
    debounce((newName: string) => {
      console.log("Renaming recipe to ", newName);
      onChange({ name: newName });
    }, 500),
    [onChange]
  );

  const handleContentChanged = useCallback(
    debounce((content: string, ingredients: IngredientRef[]) => {
      console.log("Updating recipe: ", content, ingredients);

      onChange({ content, ingredients });
    }, 1000),
    [onChange]
  );

  return (
    <Provider>
      <div className="flex flex-row border-b border-b-base-100 pb-3 mb-3 gap-2">
        <RecipeNameEditor
          name={recipe.name}
          onChange={handleRename}
          readonly={mode === "cook"}
        />
        {mode === "edit" && (
          <button className="btn btn-circle btn-ghost" onClick={openSettings}>
            <GearSixIcon size="28" weight="fill" />
          </button>
        )}
      </div>
      <p>Makes {recipe.portions} portions:</p>

      <RecipeEditor
        initialContent={recipe.content}
        onChange={handleContentChanged}
        readonly={mode === "cook"}
      />

      <div className="fixed bottom-0 left-0 p-4 flex w-full justify-between items-center">
        <button
          className="btn btn-circle btn-outline glass-bg shadow-md"
          onClick={() => navigate({ to: ".." })}
        >
          <ArrowLeftIcon weight="regular" size={20} />
        </button>

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
    </Provider>
  );
};

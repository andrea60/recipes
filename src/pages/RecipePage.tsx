import { RecipeEditor } from "../components/editor/RecipeEditor";
import { Provider } from "jotai";
import { useCallback, useState } from "react";
import {
  ArrowLeftIcon,
  ChefHatIcon,
  CookingPotIcon,
  GearSixIcon,
  PencilIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { RecipeNameEditor } from "../components/editor/RecipeNameEditor";
import { IngredientRef, Recipe } from "../data/models";
import debounce from "lodash.debounce";
import { useModal } from "../components/modal/useModal";
import { EditRecipeModal } from "../components/editor/EditRecipeModal";
import { useEditableRecipe } from "../data/useEditableRecipe";
import { FileDef } from "../data/useCreateRecipe";
import { ChangePortionsModal } from "../components/editor/ChangePortionsModal";
import { IngredientsList } from "../components/editor/IngredientsList";

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
  const [cookPortions, setCookPortions] = useState(recipe.portions);
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
      onChange({ name: newName });
    }, 500),
    [onChange]
  );

  const handleContentChanged = useCallback(
    debounce((content: string, ingredients: IngredientRef[]) => {
      if (mode === "cook") return;
      onChange({ content, ingredients });
    }, 1000),
    [onChange, mode]
  );

  const handlePortionsButtonClick = async () => {
    const { result, reason } = await openModal({
      component: ChangePortionsModal,
      title: "Change Cooking Portions",
      componentProps: { portions: cookPortions },
      fullWidth: true,
      mode: "dialog",
    });

    if (reason !== "complete") return;

    setCookPortions(result.portions);
  };

  const quantityMultiplier = cookPortions / recipe.portions;

  return (
    <Provider>
      <div className="flex flex-row border-b border-b-base-100 pb-3 mb-3 gap-2">
        <RecipeNameEditor
          name={recipe.name}
          onChange={handleRename}
          readonly={mode === "cook"}
        />
      </div>
      {mode === "cook" && (
        <div className="mb-4">
          <IngredientsList
            ingredients={recipe.ingredients}
            quantityMultiplier={quantityMultiplier}
          />
        </div>
      )}

      <h1 className="text-xl font-bold flex gap-2 items-center mb-1">
        <CookingPotIcon weight="fill" /> Cooking steps
      </h1>
      <RecipeEditor
        initialContent={recipe.content}
        onChange={handleContentChanged}
        quantityMultiplier={quantityMultiplier}
        readonly={mode === "cook"}
      />

      <div className="fixed bottom-0 left-0 p-4 flex w-full justify-between items-center">
        <button
          className="btn btn-circle btn-outline glass-bg shadow-md"
          onClick={() => navigate({ to: ".." })}
        >
          <ArrowLeftIcon weight="regular" size={20} />
        </button>

        <div className="flex gap-2">
          {mode === "cook" && (
            <button
              className="btn btn-sm btn-outline glass-bg shadow-md"
              onClick={handlePortionsButtonClick}
            >
              <UsersThreeIcon size="20" weight="bold" /> {cookPortions} Portions
            </button>
          )}
          {mode === "edit" && (
            <button
              className="btn btn-sm btn-circle btn-outline glass-bg shadow-md"
              onClick={openSettings}
            >
              <GearSixIcon size="20" weight="fill" />
            </button>
          )}
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
      </div>
    </Provider>
  );
};

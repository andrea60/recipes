import { RecipeEditor } from "./RecipeEditor";
import { Provider } from "jotai";
import { useCallback, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  BasketIcon,
  ChefHatIcon,
  CookingPotIcon,
  GearSixIcon,
  HeartIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { RecipeNameEditor } from "./RecipeNameEditor";
import { IngredientRef, Recipe } from "../../data/models";
import debounce from "lodash.debounce";
import { useModal } from "../../components/modal/useModal";
import { EditRecipeModal } from "./EditRecipeModal";
import { useEditableRecipe } from "../../data/useEditableRecipe";
import { FileDef } from "../../data/useCreateRecipe";
import { ChangePortionsModal } from "./ChangePortionsModal";
import { IngredientsList } from "./IngredientsList";
import { Tabs } from "../../components/tab/Tabs";
import { FirebaseImageDiv } from "../../firebase/components/FirebaseImageDiv";
import {
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { motion } from "motion/react";
import {
  CollapsibleHeaderLayout,
  useCollapsibleHeaderState,
} from "../../components/ui/CollapsibleHeaderLayout";
import classNames from "classnames";
import { PortionsQuantityControls } from "./PortionQuantityControls";

export type RecipeMode = "edit" | "cook";
export type RecipeView = "recipe" | "ingredients";

export const RecipePage = () => {
  const { id } = useParams({ from: "/recipes/$id" });
  const navigate = useNavigate();

  const recipeDoc = useEditableRecipe(id);

  if (recipeDoc.pending) return <div>Loading</div>;
  if (!recipeDoc.found) return <div>Not found</div>;

  return (
    <CollapsibleHeaderLayout
      headerActionBar={
        <div className="w-full flex justify-between">
          <button
            className="btn btn-circle btn-outline bg-base-200 shadow-lg shadow-black/25"
            onClick={() => navigate({ to: ".." })}
          >
            <ArrowLeftIcon fontSize={20} weight="bold" />
          </button>
          <button className="btn btn-circle btn-outline bg-base-200 shadow-lg shadow-black/25">
            <HeartIcon fontSize={20} weight="regular" />
          </button>
        </div>
      }
      headerContent={
        <FirebaseImageDiv
          firebasePath={recipeDoc?.data?.imagePath ?? ""}
          className="bg-center bg-cover bg-no-repeat h-full w-full"
        />
      }
    >
      <RecipePageContent
        recipe={recipeDoc.data}
        onChange={recipeDoc.updateAction.execute}
      />
    </CollapsibleHeaderLayout>
  );
};

type Props = {
  recipe: Recipe;
  onChange: (update: Partial<Recipe>, image?: FileDef) => void;
};
const RecipePageContent = ({ recipe, onChange }: Props) => {
  const { isAnchored } = useCollapsibleHeaderState();
  const navigate = useNavigate();
  const { mode = "cook", view = "recipe" } = useSearch({
    from: "/recipes/$id",
  });
  const [cookPortions, setCookPortions] = useState(recipe.portions);
  const { openModal } = useModal();

  const setMode = (mode: RecipeMode) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, mode }) });
  };

  const setView = (view: RecipeView) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, view }) });
  };

  const toggleMode = () => {
    if (mode === "edit") {
      setMode("cook");
    } else {
      setMode("edit");
      setView("recipe");
    }
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

  const quantityMultiplier = cookPortions / recipe.portions;

  const displayPortions = mode === "cook" ? cookPortions : recipe.portions;

  return (
    <Provider>
      <div className="flex justify-center">
        <AnimatePresence>
          {mode === "cook" && (
            <PortionsQuantityControls
              onChange={setCookPortions}
              portions={cookPortions}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-row border-b border-b-base-100 pb-3 mb-3 gap-2 pt-2">
        <RecipeNameEditor
          name={recipe.name}
          onChange={handleRename}
          readonly={mode === "cook"}
        />
      </div>
      <Tabs
        maxWidth={384}
        disabled={mode !== "cook"}
        onTabChange={(id) => setView(id as RecipeView)}
        selectedId={view}
        enableScroll={isAnchored}
        tabs={[
          {
            id: "recipe",
            header: (
              <>
                <CookingPotIcon weight="fill" /> Cooking Steps
              </>
            ),
            content: (
              <>
                <h1 className="my-4 text-2xl font-bold">
                  Instructions for {displayPortions} portions:
                </h1>
                <RecipeEditor
                  initialContent={recipe.content}
                  onChange={handleContentChanged}
                  quantityMultiplier={quantityMultiplier}
                  readonly={mode === "cook"}
                />
              </>
            ),
          },
          {
            id: "ingredients",
            header: (
              <>
                <BasketIcon weight="fill" /> Ingredients
              </>
            ),
            content: (
              <IngredientsList
                ingredients={recipe.ingredients}
                quantityMultiplier={quantityMultiplier}
              />
            ),
          },
        ]}
      />

      <div className="fixed bottom-0 left-0 p-8 flex w-full justify-end items-center">
        <button
          className="btn btn-circle btn-outline btn-lg glass-bg"
          onClick={toggleMode}
        >
          <label
            className={classNames("swap text-2xl", {
              "swap-active": mode === "cook",
            })}
          >
            <div className="swap-on">
              <ChefHatIcon weight="fill" />
            </div>
            <div className="swap-off">
              <PencilIcon weight="fill" />
            </div>
          </label>
        </button>
      </div>
    </Provider>
  );
};

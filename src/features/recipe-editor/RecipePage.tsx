import { RecipeEditor } from "./RecipeEditor";
import { Provider } from "jotai";
import { useCallback, useState } from "react";
import {
  ArrowLeftIcon,
  BasketIcon,
  ChefHatIcon,
  CookingPotIcon,
  GearSixIcon,
  HeartIcon,
  PencilIcon,
} from "@phosphor-icons/react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { RecipeNameEditor } from "./RecipeNameEditor";
import { IngredientRef, Recipe } from "../../data/models";
import debounce from "lodash.debounce";
import { useModal } from "../../components/modal/useModal";
import { EditRecipeModal } from "./EditRecipeModal";
import { useEditableRecipe } from "../../data/useEditableRecipe";
import { FileDef } from "../../data/useCreateRecipe";
import { IngredientsList } from "./IngredientsList";
import { Tabs } from "../../components/tab/Tabs";
import { FirebaseImageDiv } from "../../firebase/components/FirebaseImageDiv";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import {
  CollapsibleHeaderLayout,
  useCollapsibleHeaderState,
} from "../../components/ui/CollapsibleHeaderLayout";
import classNames from "classnames";
import { PortionsQuantityControls } from "./PortionQuantityControls";
import { useWakeLock } from "../../utils/useWakeLock";
import { vibrate } from "../../utils/vibrate";
import { useCategories } from "../../data/Categories";
import { CategoryIcon } from "../../components/ui/CategoryIcon";

export type RecipeMode = "edit" | "cook";
export type RecipeView = "recipe" | "ingredients";

export const RecipePage = () => {
  const { id } = useParams({ from: "/recipes/$id/" });
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { mode = "cook" } = useSearch({
    from: "/recipes/$id/",
  });
  useWakeLock(mode === "cook");

  const recipeDoc = useEditableRecipe(id);

  if (!recipeDoc.pending && !recipeDoc.found) {
    return <div>Not found</div>;
  }

  if (recipeDoc.pending) {
    return (
      <CollapsibleHeaderLayout headerContent={<></>}>
        <h1 className="text-center">
          <span className="loading loading-dots mr-2" />
          Loading...
        </h1>
      </CollapsibleHeaderLayout>
    );
  }

  const onActionClick = async () => {
    if (mode === "edit") {
      openSettings();
    } else if (mode === "cook") {
      recipeDoc.updateAction.execute({
        isFavourite: !recipeDoc.data.isFavourite,
      });
    }
  };

  const openSettings = () => {
    openModal({
      title: "Update Recipe",
      component: EditRecipeModal,
      componentProps: recipeDoc.data,
      mode: "dialog",
    });
  };

  return (
    <CollapsibleHeaderLayout
      headerActionBar={
        <div className="w-full flex justify-between">
          <button
            className="btn btn-circle btn-outline btn-lg bg-base-200 shadow-lg shadow-black/25"
            onClick={() => navigate({ to: ".." })}
          >
            <ArrowLeftIcon size={24} weight="bold" />
          </button>

          <button
            onClick={onActionClick}
            className={classNames(
              "btn btn-circle btn-outline bg-base-200 btn-lg shadow-lg shadow-black/25 swap swap-rotate",
              { "swap-active": mode === "cook" }
            )}
          >
            <HeartIcon
              className="swap-on"
              size={24}
              weight={recipeDoc.data.isFavourite ? "fill" : "regular"}
            />

            <GearSixIcon className="swap-off" size={24} weight="regular" />
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
    from: "/recipes/$id/",
  });
  const [cookPortions, setCookPortions] = useState(recipe.portions);
  const { categoriesMap } = useCategories();

  const setMode = (mode: RecipeMode) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, mode }), replace: true });
  };

  const setView = (view: RecipeView) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, view }), replace: true });
  };

  const toggleMode = () => {
    vibrate();
    if (mode === "edit") {
      setMode("cook");
    } else {
      setMode("edit");
      setView("recipe");
    }
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
      <div className="flex flex-row  mb-3 gap-2 pt-2">
        <RecipeNameEditor
          name={recipe.name}
          onChange={handleRename}
          readonly={mode === "cook"}
        />
      </div>
      {mode === "cook" && (
        <motion.div className="flex flex-row gap-2 mb-4">
          {recipe.categories.map((catId) => {
            const category = categoriesMap.get(catId);
            if (!category) return null;

            return (
              <span
                key={category.id}
                className="badge badge-lg shadow shadow-black/50"
              >
                <CategoryIcon iconName={category.icon} weight="fill" />{" "}
                {category.name}
              </span>
            );
          })}
        </motion.div>
      )}
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
                <h1 className="mb-4 text-2xl font-bold">
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

      <div className="fixed bottom-0 left-0 p-6 flex w-full justify-end items-center">
        <motion.button
          className="btn btn-circle btn-outline btn-lg glass-bg"
          whileTap={{ scale: 0.7 }}
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
        </motion.button>
      </div>
    </Provider>
  );
};

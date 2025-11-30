import { RecipeEditor } from "./RecipeEditor";
import { Provider } from "jotai";
import { useCallback, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  BasketIcon,
  ChefHatIcon,
  CookingPotIcon,
  GearSixIcon,
  PencilIcon,
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
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { motion } from "motion/react";

export type RecipeMode = "edit" | "cook";
export type RecipeView = "recipe" | "ingredients";

export const RecipePage = () => {
  const { id } = useParams({ from: "/recipes/$id" });

  const recipeDoc = useEditableRecipe(id);

  if (recipeDoc.pending) return <div>Loading</div>;
  if (!recipeDoc.found) return <div>Not found</div>;

  return (
    <RecipePageContent
      recipe={recipeDoc.data}
      onChange={recipeDoc.updateAction.execute}
    />
  );
};

const MAX_HEADER = 280; // px
const MIN_HEADER = 80; // px
const COLLAPSE_DISTANCE = 200; // px of scroll until fully collapsed

type Props = {
  recipe: Recipe;
  onChange: (update: Partial<Recipe>, image?: FileDef) => void;
};
const RecipePageContent = ({ recipe, onChange }: Props) => {
  const navigate = useNavigate();
  const { mode = "cook", view = "recipe" } = useSearch({
    from: "/recipes/$id",
  });
  const [cookPortions, setCookPortions] = useState(recipe.portions);
  const { openModal } = useModal();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress, scrollY } = useScroll({
    container: containerRef, // <-- track scroll inside this div
  });
  const progress = useMotionValue(0);

  // Update progress based on scrollY
  useMotionValueEvent(scrollY, "change", (latest) => {
    const p = Math.min(latest / COLLAPSE_DISTANCE, 1);
    console.log("scroll progress:", p);
    progress.set(p);
  });

  const height = useTransform(progress, [0, 1], [MAX_HEADER, MIN_HEADER]);

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
      <div className="h-screen overflow-y-auto" ref={containerRef}>
        {/* Header with image */}
        <motion.div
          className="sticky top-0 z-20"
          style={{ height: MAX_HEADER }}
        >
          <motion.div
            style={{ height: height }}
            className="absolute top-0 w-full"
          >
            <FirebaseImageDiv
              firebasePath={recipe.imagePath}
              className="bg-center bg-cover bg-no-repeat h-full w-full"
            />
          </motion.div>
        </motion.div>

        {/* Page content */}
        <motion.div
          className="p-4 h-screen"
          style={{ height: `calc(100vh - ${MIN_HEADER}px)` }}
        >
          <div className="flex flex-row border-b border-b-base-100 pb-3 mb-3 gap-2">
            <RecipeNameEditor
              name={recipe.name}
              onChange={handleRename}
              readonly={mode === "cook"}
            />
          </div>
          <Tabs
            maxWidth={384}
            onTabChange={(id) => setView(id as RecipeView)}
            selectedId={view}
            tabs={[
              {
                id: "recipe",
                header: (
                  <>
                    <CookingPotIcon weight="fill" /> Cooking Steps
                  </>
                ),
                content: (
                  <RecipeEditor
                    initialContent={recipe.content}
                    onChange={handleContentChanged}
                    quantityMultiplier={quantityMultiplier}
                    readonly={mode === "cook"}
                  />
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
                  <UsersThreeIcon size="20" weight="bold" /> {cookPortions}{" "}
                  Portions
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
                <ChefHatIcon
                  aria-label="disabled"
                  size="inherit"
                  weight="fill"
                />
                <PencilIcon aria-label="enabled" size="inherit" weight="fill" />
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </Provider>
  );
};

import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { useRecipes } from "../../data/useRecipes";
import { useModal } from "../../components/modal/useModal";
import { useCreateRecipe } from "../../data/useCreateRecipe";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/useAuth";
import { Avatar } from "../../components/Avatar";
import { CreateRecipeModal } from "./CreateRecipeModal";
import { RecipeCard } from "./RecipeCard";

export const RecipesListPage = () => {
  const recipes = useRecipes();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const createRecipeAction = useCreateRecipe();
  const { user } = useAuth();

  const handleCreate = async () => {
    // Open modal to create a new recipe
    const modalResult = await openModal({
      title: "Create New Recipe",
      component: CreateRecipeModal,
      componentProps: {},
      mode: "dialog",
    });
    if (modalResult.reason !== "complete") return;

    const id = await createRecipeAction.execute(
      modalResult.result.name,
      modalResult.result.portions,
      modalResult.result.image
    );
    navigate({ to: "/recipes/$id", params: { id } });
  };

  return (
    <>
      <div className="flex flex-row mb-4">
        <div className="grow flex items-center gap-2">
          <Avatar photoUrl={user?.displayName || ""} />
          <h1>Welcome {user?.displayName}</h1>
        </div>
        <button className="btn btn-outline btn-circle" onClick={handleCreate}>
          <PlusCircleIcon size="24" weight="fill" />
        </button>
      </div>
      <div className="mb-4">
        <label className="input w-full">
          <MagnifyingGlassIcon size={22} />
          <input type="text" className="grow" placeholder="Search..." />
          <div>
            <button className="btn btn-sm shadow-md relative -right-2">
              <SlidersHorizontalIcon size={22} />
            </button>
          </div>
        </label>
      </div>
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>
      <div className="flex flex-wrap gap-8 cursor-pointer">
        {recipes.data?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
};

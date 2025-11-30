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
import { LogoutModal } from "./LogoutModal";
import { MasonryGrid } from "../../components/ui/Masonry";
import { useRef } from "react";
import { useScrollState } from "../../utils/useScrollState";
import classNames from "classnames";

export const RecipesListPage = () => {
  const recipes = useRecipes();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const createRecipeAction = useCreateRecipe();
  const { user, signOut } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);

  const isScrolling = useScrollState(contentRef);

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

  const handleLogout = async () => {
    const { reason } = await openModal({
      component: LogoutModal,
      componentProps: {},
      mode: "dialog",
      title: "Would you like to log out?",
    });

    if (reason === "complete") {
      // Perform logout
      await signOut();
    }
  };

  return (
    <>
      <div
        className={classNames("fixed w-100 top-0  p-4 pb-1 rounded-b-4xl", {
          "shadow-sm shadow-black glass-bg-3 bg-base-200": isScrolling,
        })}
      >
        <div className="flex flex-row mb-4 justify-between">
          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogout}
          >
            <Avatar photoUrl={user?.photoURL || ""} />
            <h1>Welcome {getFirstName(user?.displayName ?? "")}</h1>
          </button>
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
      </div>
      <div className="flex-1 p-4 pt-36 overflow-y-auto" ref={contentRef}>
        <div className="">
          <h1 className="text-3xl font-bold mb-4">Recipes</h1>
          <MasonryGrid elements={recipes.data ?? []}></MasonryGrid>
        </div>
      </div>
    </>
  );
};

const getFirstName = (fullName: string | undefined) => {
  if (!fullName) return "";
  return fullName.split(" ")[0];
};

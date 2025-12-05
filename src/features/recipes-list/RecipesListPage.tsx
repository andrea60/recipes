import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { useRecipes } from "../../data/useRecipes";
import { useModal } from "../../components/modal/useModal";
import { useCreateRecipe } from "../../data/useCreateRecipe";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../../auth/useAuth";
import { Avatar } from "../../components/Avatar";
import { CreateRecipeModal } from "./CreateRecipeModal";
import { LogoutModal } from "./LogoutModal";
import { MasonryGrid } from "../../components/ui/Masonry";
import { useRef, useState } from "react";
import { useScrollState } from "../../utils/useScrollState";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { SearchDrawer } from "./SearchDrawer";

export type RecipesListFilters = {
  searchTerm?: string;
  categoryId?: string;
};

export const RecipesListPage = () => {
  const filters = useSearch({ from: "/recipes/" });
  const recipes = useRecipes(filters);
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { user, signOut } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);

  const { isAtTop } = useScrollState(contentRef);

  const handleCreate = async () => {
    // Open modal to create a new recipe
    const modalResult = await openModal({
      title: "Create New Recipe",
      component: CreateRecipeModal,
      componentProps: {},
      mode: "dialog",
    });
    if (modalResult.reason !== "complete") return;

    const { id } = modalResult.result;
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
      <motion.div
        className={classNames(
          "w-full px-4 flex flex-row justify-between items-center z-10 bg-base-200 rounded-b-xl",
          {
            "shadow-md shadow-black": !isAtTop,
          }
        )}
        animate={{
          paddingTop: isAtTop ? 16 : 10,
          paddingBottom: isAtTop ? 16 : 10,
        }}
      >
        <button
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogout}
        >
          <Avatar photoUrl={user?.photoURL || ""} />
          <h1>Welcome {getFirstName(user?.displayName ?? "")}</h1>
        </button>
        <motion.button
          layout="size"
          className={classNames("btn btn-circle")}
          onClick={handleCreate}
        >
          <PlusCircleIcon size={48} weight="fill" />
        </motion.button>
      </motion.div>
      <div className="flex-1 p-4 overflow-y-auto" ref={contentRef}>
        <h1 className="text-3xl font-bold mb-4">Recipes</h1>
        <MasonryGrid elements={recipes.data ?? []} />
      </div>
      <SearchDrawer />
    </>
  );
};

const getFirstName = (fullName: string | undefined) => {
  if (!fullName) return "";
  return fullName.split(" ")[0];
};

import { PlusCircleIcon } from "@phosphor-icons/react";
import { useRecipes } from "../data/useRecipes";
import { ModalContentProps, useModal } from "../components/modal/useModal";
import { useState } from "react";
import { useCreateRecipe } from "../data/useCreateRecipe";
import { useNavigate } from "@tanstack/react-router";

export const RecipesList = () => {
  const recipes = useRecipes();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const createRecipeAction = useCreateRecipe();

  const handleCreate = async () => {
    // Open modal to create a new recipe
    const modalResult = await openModal({
      title: "Create New Recipe",
      component: CreateRecipeModalContent,
      componentProps: {},
      mode: "dialog",
    });
    if (modalResult.reason !== "complete") return;

    const id = await createRecipeAction.execute(modalResult.result.name);
    console.log("Created recipe with ID:", id);
    navigate({ to: "/recipes/$id", params: { id } });
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="grow" />
        <button className="btn btn-outline btn-circle" onClick={handleCreate}>
          <PlusCircleIcon size="24" weight="fill" />
        </button>
      </div>
      {recipes.data?.map((recipe) => (
        <div className="card card-default" key={recipe.id}>
          <div className="card-body">{recipe.name}</div>
        </div>
      ))}
    </>
  );
};

type ModalProps = ModalContentProps<{ name: string }>;
const CreateRecipeModalContent = ({ close }: ModalProps) => {
  const [name, setName] = useState("");
  const valid = name.trim().length > 0;
  return (
    <>
      <fieldset className="fieldset min-w-96">
        <legend className="fieldset-legend">
          What's the name of the recipe?
        </legend>
        <input
          type="text"
          className="input w-full"
          placeholder="Enter the name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </fieldset>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-neutral">Cancel</button>
        <button
          className="btn btn-primary grow"
          disabled={!valid}
          onClick={() => close({ name })}
        >
          Create
        </button>
      </div>
    </>
  );
};

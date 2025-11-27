import { PlusCircleIcon } from "@phosphor-icons/react";
import { useRecipes } from "../data/useRecipes";
import { ModalContentProps, useModal } from "../components/modal/useModal";
import { useState } from "react";
import { FileDef, useCreateRecipe } from "../data/useCreateRecipe";
import { useNavigate } from "@tanstack/react-router";
import { FileInput } from "../components/FileInput";

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

    const id = await createRecipeAction.execute(
      modalResult.result.name,
      modalResult.result.portions,
      modalResult.result.image
    );
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
      <div className="flex gap-2">
        {recipes.data?.map((recipe) => (
          <div
            className="card card-sm card-default w-60 h-60"
            key={recipe.id}
            onClick={() =>
              navigate({
                to: "/recipes/$id",
                params: { id: recipe.id },
              })
            }
          >
            <div className="card-body text">
              <div className="card-title">{recipe.name}</div>
              <div
                className="tiptap"
                dangerouslySetInnerHTML={{ __html: recipe.content }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

type ModalProps = ModalContentProps<{
  name: string;
  portions: number;
  image: FileDef;
}>;
const CreateRecipeModalContent = ({ close, cancel }: ModalProps) => {
  const [name, setName] = useState("");
  const [portions, setPortions] = useState(2);
  const [image, setImage] = useState<FileDef>();

  const valid = name.trim().length > 0 && portions > 0 && !!image;
  return (
    <>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <fieldset className="fieldset min-w-96 col-span-2">
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
        <fieldset className="fieldset ">
          <legend className="fieldset-legend">How many portions?</legend>
          <input
            type="number"
            className="input"
            placeholder="Enter how many portions does this recipe make"
            value={portions}
            onChange={(e) => setPortions(e.target.valueAsNumber)}
            autoFocus
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Picture</legend>
          <FileInput onChange={setImage} />
        </fieldset>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-neutral" onClick={cancel}>
          Cancel
        </button>
        <button
          className="btn btn-primary grow"
          disabled={!valid}
          onClick={() => close({ name, portions, image: image! })}
        >
          Create
        </button>
      </div>
    </>
  );
};

import { useState } from "react";
import { FileInput } from "../../components/FileInput";
import { ModalContentProps } from "../../components/modal/useModal";
import { FileDef, useCreateRecipe } from "../../data/useCreateRecipe";
import { FileSelector } from "./FileSelector";
import { CategoriesSelector } from "../../components/ui/CategoriesSelector";

type ModalProps = ModalContentProps<{
  id: string;
}>;
export const CreateRecipeModal = ({ close, cancel }: ModalProps) => {
  const [name, setName] = useState("");
  const [portions, setPortions] = useState(2);
  const [categories, setCategories] = useState<string[]>([]);
  const [image, setImage] = useState<FileDef>();
  const createRecipeAction = useCreateRecipe();

  const valid = name.trim().length > 0 && portions > 0 && !!image;
  const create = async () => {
    if (!valid) return;

    const id = await createRecipeAction.execute(name, portions, image);

    close({ id });
  };

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <fieldset className="fieldset min-w-80 col-span-2">
          <legend className="fieldset-legend">
            What's the name of the recipe?
          </legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Enter the name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          />
        </fieldset>
        <FileSelector onChange={setImage} />
        <CategoriesSelector
          className="col-span-2"
          onChange={setCategories}
          selected={categories}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-neutral" onClick={cancel}>
          Cancel
        </button>
        <button
          className="btn btn-primary grow"
          disabled={!valid || createRecipeAction.inProgress}
          onClick={create}
        >
          {createRecipeAction.inProgress ? (
            <>
              <span className="loading loading-ring loading-xs" /> Creating...
            </>
          ) : (
            <>Create</>
          )}
        </button>
      </div>
    </>
  );
};

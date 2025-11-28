import { useState } from "react";
import { FileInput } from "../../components/FileInput";
import { ModalContentProps } from "../../components/modal/useModal";
import { FileDef } from "../../data/useCreateRecipe";

type ModalProps = ModalContentProps<{
  name: string;
  portions: number;
  image: FileDef;
}>;
export const CreateRecipeModal = ({ close, cancel }: ModalProps) => {
  const [name, setName] = useState("");
  const [portions, setPortions] = useState(2);
  const [image, setImage] = useState<FileDef>();

  const valid = name.trim().length > 0 && portions > 0 && !!image;
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

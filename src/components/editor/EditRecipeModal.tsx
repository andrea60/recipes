import { Recipe } from "../../data/models";
import { FileDef } from "../../data/useCreateRecipe";
import { useEditRecipe } from "../../data/useEditableRecipe";
import { useTrackedState } from "../../utils/useTrackedState";
import { FileInput } from "../FileInput";
import { ModalContentProps } from "../modal/useModal";

type ModalProps = ModalContentProps<{}, Recipe>;
export const EditRecipeModal = ({ close, cancel, ...recipe }: ModalProps) => {
  const updateAction = useEditRecipe(recipe.id);
  const [portions, setPortions, portionsDirty] = useTrackedState(
    recipe.portions
  );
  const [image, setImage, imageDirty] = useTrackedState<FileDef | undefined>(
    undefined
  );

  const valid = portions > 0;
  const isDirty = portionsDirty || imageDirty;

  const confirm = async () => {
    const update: Partial<Recipe> = {};
    if (portionsDirty) update["portions"] = portions;

    await updateAction.execute(update, image);

    close({});
  };

  return (
    <>
      <div className="flex gap-2">
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
          disabled={!valid || !isDirty || updateAction.inProgress}
          onClick={confirm}
        >
          {updateAction.inProgress ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
};

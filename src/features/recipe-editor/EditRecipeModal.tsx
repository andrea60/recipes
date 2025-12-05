import { Recipe } from "../../data/models";
import { FileDef } from "../../data/useCreateRecipe";
import { useEditRecipe } from "../../data/useEditableRecipe";
import { useTrackedState } from "../../utils/useTrackedState";
import { FileInput } from "../../components/FileInput";
import { ModalContentProps } from "../../components/modal/useModal";
import { CategoriesSelector } from "../../components/ui/CategoriesSelector";

type ModalProps = ModalContentProps<{}, Recipe>;
export const EditRecipeModal = ({ close, cancel, ...recipe }: ModalProps) => {
  const updateAction = useEditRecipe(recipe.id);
  const [portions, setPortions, portionsDirty] = useTrackedState(
    recipe.portions
  );
  const [image, setImage, imageDirty] = useTrackedState<FileDef | undefined>(
    undefined
  );

  const [categories, setCategories, categoriesDirty] = useTrackedState<
    string[]
  >(recipe.categories);

  const valid = portions > 0;
  const isDirty = portionsDirty || imageDirty || categoriesDirty;

  const confirm = async () => {
    const update: Partial<Recipe> = {};
    if (portionsDirty) update["portions"] = portions;
    if (categoriesDirty) update["categories"] = categories;

    await updateAction.execute(update, image);

    close({});
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <fieldset className="fieldset grow">
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
        <fieldset className="fieldset grow">
          <legend className="fieldset-legend">Picture</legend>
          <FileInput onChange={setImage} />
        </fieldset>
        <CategoriesSelector
          onChange={setCategories}
          selected={categories ?? []}
        />
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

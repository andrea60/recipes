import { Recipe } from "../../data/models";
import { useFirebaseDownloadUrl } from "../../firebase/useFirebaseDownloadUrl";

type Props = {
  recipe: Recipe;
  size: number;
};
export const RecipesImagePreview = ({ recipe, size }: Props) => {
  const url = useFirebaseDownloadUrl(recipe.imagePath);

  return (
    <div
      className="bg-center bg-no-repeat bg-cover rounded-2xl"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${url})`,
      }}
    ></div>
  );
};

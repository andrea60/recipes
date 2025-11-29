import classNames from "classnames";
import { Recipe } from "../../data/models";
import { useFirebaseDownloadUrl } from "../../firebase/useFirebaseDownloadUrl";
import { useRef, useState } from "react";

type Props = {
  recipe: Recipe;
  aspectRatio: string;
};
export const RecipesImagePreview = ({ recipe, aspectRatio }: Props) => {
  const url = useFirebaseDownloadUrl(recipe.imagePath);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);

  const onImageLoaded = () => {
    setImageReady(true);
  };

  return (
    <div
      ref={containerRef}
      className={classNames(
        "rounded-2xl shadow-md shadow-black",
        imageReady ? "bg-center bg-no-repeat bg-cover" : "skeleton"
      )}
      style={{
        width: "100%",
        aspectRatio: aspectRatio,
        backgroundImage: imageReady ? `url(${url})` : undefined,
      }}
    >
      <img src={url} className="hidden" onLoad={onImageLoaded} />
    </div>
  );
};

import { doc, setDoc } from "firebase/firestore";
import { useAsyncAction } from "../firebase/useAsyncAction";
import { imageRef, recipesCollection } from "../firebase/firebase-references";
import { uploadBytes } from "firebase/storage";

export type FileDef = {
  content: ArrayBuffer;
  extension: string;
  contentType: string;
};

export const useCreateRecipe = () => {
  const createRecipe = async (
    name: string,
    portions: number,
    image: FileDef
  ) => {
    const id: string = crypto.randomUUID();

    const ref = imageRef([id, image.extension].join("."));

    await uploadBytes(ref, image.content, { contentType: image.contentType });

    await setDoc(doc(recipesCollection(), id), {
      id,
      name,
      ingredients: [],
      portions,
      imagePath: ref.fullPath,
      content: "",
    });
    return id;
  };

  return useAsyncAction(createRecipe);
};

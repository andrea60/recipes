import { doc, setDoc } from "firebase/firestore";
import { useAsyncAction } from "../firebase/useAsyncAction";
import { recipesCollection } from "../firebase/firebase-collections";

export const useCreateRecipe = () => {
  const createRecipe = async (name: string) => {
    const id: string = crypto.randomUUID();

    await setDoc(doc(recipesCollection(), id), {
      id,
      name,
      ingredients: [],
      content: "",
    });
    return id;
  };

  return useAsyncAction(createRecipe);
};

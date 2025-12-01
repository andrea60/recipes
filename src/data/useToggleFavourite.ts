import { doc, updateDoc } from "firebase/firestore";
import { recipesCollection } from "../firebase/firebase-references";
import { useAsyncAction } from "../firebase/useAsyncAction";

export const useToggleFavourite = () => {
  const toggleFavourite = async (id: string, isFavourite: boolean) => {
    const recipeRef = doc(recipesCollection(), id);

    await updateDoc(recipeRef, { isFavourite: isFavourite });
  };

  return useAsyncAction(toggleFavourite);
};

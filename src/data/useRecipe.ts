import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { useDoc } from "../firebase/queries/useDoc";
import {
  ingredientsCollection,
  recipesCollection,
} from "../firebase/firebase-collections";
import { useAsyncAction } from "../firebase/useAsyncAction";
import { IngredientRef } from "./models";
import { db } from "../firebase/firebase.config";

export const useRecipe = (id: string) => {
  return useDoc(doc(recipesCollection(), id));
};

export const useEditRecipe = (id: string) => {
  const rename = useAsyncAction((name: string) =>
    updateDoc(doc(recipesCollection(), id), { name })
  );

  const updateContent = useAsyncAction(
    async (content: string, ingredients: IngredientRef[]) => {
      // update recipe itself
      await updateDoc(doc(recipesCollection(), id), { content, ingredients });

      // register the ingredients in the ingredients DB
      const batch = writeBatch(db);
      ingredients.forEach((i) =>
        batch.set(doc(ingredientsCollection(), i.id), {
          id: i.id,
          name: i.name,
        })
      );
      await batch.commit();
    }
  );

  return { rename, updateContent };
};

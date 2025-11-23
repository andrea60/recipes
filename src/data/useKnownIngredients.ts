import { ingredientsCollection } from "../firebase/firebase-collections";
import { useAsyncAction } from "../firebase/useAsyncAction";
import { useRealtimeQuery } from "../firebase/queries/useRealtimeQuery";
import { doc, setDoc } from "firebase/firestore";

export const useKnownIngredients = () => {
  return useRealtimeQuery(ingredientsCollection());
};

export const getIngredientId = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};
export const normalizeIngredientName = (name: string) => {
  // Trim and capitalize first letter of each word
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const useCreateIngredient = () => {
  const createIngredient = async (name: string) => {
    const id = getIngredientId(name);
    const ref = doc(ingredientsCollection(), id);

    const newDoc = { id, name: normalizeIngredientName(name) };
    await setDoc(ref, newDoc);

    return newDoc;
  };

  return useAsyncAction(createIngredient);
};

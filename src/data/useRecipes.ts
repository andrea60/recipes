import { recipesCollection } from "../firebase/firebase-collections";
import { useRealtimeQuery } from "../firebase/queries/useRealtimeQuery";

export const useRecipes = () => {
  return useRealtimeQuery(recipesCollection());
};

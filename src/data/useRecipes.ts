import { recipesCollection } from "../firebase/firebase-references";
import { useRealtimeQuery } from "../firebase/queries/useRealtimeQuery";

export const useRecipes = () => {
  return useRealtimeQuery(recipesCollection());
};

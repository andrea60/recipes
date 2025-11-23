import { collection, CollectionReference } from "firebase/firestore";
import { auth, db } from "./firebase.config";
import { Ingredient, Recipe } from "../data/models";

export const ingredientsCollection = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  return collection(
    db,
    `userData/${userId}/ingredients`
  ) as CollectionReference<Ingredient>;
};

export const recipesCollection = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");
  return collection(
    db,
    `userData/${userId}/recipes`
  ) as CollectionReference<Recipe>;
};

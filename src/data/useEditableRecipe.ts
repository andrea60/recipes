import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDoc } from "../firebase/queries/useDoc";
import { useResettableState } from "../utils/useResettableState";
import { useAsyncAction } from "../firebase/useAsyncAction";
import { Recipe } from "./models";
import { imageRef, recipesCollection } from "../firebase/firebase-references";
import { FileDef } from "./useCreateRecipe";
import { uploadBytes } from "firebase/storage";
import { create } from "zustand";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

const localCopyAtom = atom<Recipe | undefined>(undefined);

export const useEditRecipe = (id: string) => {
  const setLocalCopy = useSetAtom(localCopyAtom);
  return useAsyncAction(async (update: Partial<Recipe>, image?: FileDef) => {
    if (image) {
      // repload image
      const ref = imageRef([id, image.extension].join("."));
      await uploadBytes(ref, image.content, {
        contentType: image.contentType,
      });
    }

    if (Object.values(update).length > 0) {
      await updateDoc(doc(recipesCollection(), id), update);
      setLocalCopy((c) => (c === undefined ? undefined : { ...c, ...update }));
    }
  });
};

export const useEditableRecipe = (id: string) => {
  const recipe = useDoc(doc(recipesCollection(), id), [id]);
  const [localCopy, setState] = useAtom(localCopyAtom);

  useEffect(() => {
    // reset the state if the recipes is reloaded
    setState(recipe.data);
  }, [recipe]);

  const updateAction = useEditRecipe(id);

  const update = useAsyncAction(async (recipe: Partial<Recipe>) => {
    await updateAction.execute(recipe);
    setState((c) => {
      if (!c) return c;
      return { ...c, ...update };
    });
  });

  if (!recipe.found) return { pending: false, found: false } as const;
  if (recipe.pending || !localCopy) return { pending: true } as const;

  console.log(localCopy);
  return {
    pending: false,
    found: true,
    data: localCopy!,
    updateAction: update,
  } as const;
};

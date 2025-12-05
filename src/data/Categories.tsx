import { createContext, PropsWithChildren, useContext } from "react";
import { categoriesCollection } from "../firebase/firebase-references";
import { useQuery } from "../firebase/queries/useQuery";
import { Category } from "./models";

const Ctx = createContext<Category[]>([]);

export const CategoriesProvider = ({ children }: PropsWithChildren) => {
  const categories = useQuery(categoriesCollection());
  console.log({ categories });

  return <Ctx.Provider value={categories?.data ?? []}>{children}</Ctx.Provider>;
};

export const useCategories = () => {
  return useContext(Ctx);
};

import { createContext, PropsWithChildren, useContext, useMemo } from "react";
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
  const categories = useContext(Ctx);

  const categoriesMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [categories]);

  return { categories, categoriesMap };
};

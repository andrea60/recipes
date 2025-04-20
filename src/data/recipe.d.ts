export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  nutritionalFacts?: NutritionalFacts;
};

export type NutritionalFacts = {
  kcal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
};

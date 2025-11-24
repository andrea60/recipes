export type Ingredient = {
  id: string;
  name: string;
};

export type IngredientRef = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: string;
  name: string;
  content: string;
  portions: number;
  imagePath: string;
  ingredients: IngredientRef[];
};

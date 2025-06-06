// frontend/src/types/recipe.ts
// Create this new file for recipe types

export interface RecipeDataType {
  id: string;
  recipeName: string;
  reviews: number;
  imageUrl: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  cuisines?: string[];
  diets?: string[];
  dishTypes?: string[];
}

export interface DetailedRecipe {
  id: string;
  name: string;
  image: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  chef: string;
  tags: string[];
  ingredients: Array<{
    name: string;
    quantity: string;
  }>;
  directions: string[];
  sourceUrl?: string;
  cuisines?: string[];
  diets?: string[];
  dishTypes?: string[];
}

export interface SavedRecipeData {
  recipe_id: string;
  title: string;
  image: string;
  description: string;
  cooking_time: number;
  servings: number;
  difficulty: string;
  rating: number;
  chef: string;
  ingredients: string; // JSON string
  directions: string; // JSON string
  tags: string; // JSON string
}

export interface SavedRecipe {
  id: number;
  user_id: number;
  recipe_id: string;
  title: string;
  image: string;
  description: string;
  cooking_time: number;
  servings: number;
  difficulty: string;
  rating: number;
  chef: string;
  ingredients: string;
  directions: string;
  tags: string;
  created_at: string;
}

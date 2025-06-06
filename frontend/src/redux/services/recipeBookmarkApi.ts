// frontend/src/redux/services/recipeBookmarkApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../helpers/baseQuery';
import { API_Methods } from '../helpers/types';

export const recipeBookmarkApi = createApi({
  reducerPath: 'recipeBookmarkApi',
  baseQuery: baseQuery,
  tagTypes: ['SavedRecipe'],
  endpoints: builder => ({
    // Save a recipe to collection
    saveRecipe: builder.mutation<{ message: string }, SavedRecipeData>({
      query: recipeData => ({
        url: 'saved-recipes',
        method: API_Methods.POST,
        body: recipeData,
      }),
      invalidatesTags: ['SavedRecipe'],
    }),

    // Get all saved recipes
    getSavedRecipes: builder.query<SavedRecipe[], void>({
      query: () => ({
        url: 'saved-recipes',
        method: API_Methods.GET,
      }),
      providesTags: ['SavedRecipe'],
    }),

    // Remove a saved recipe
    removeSavedRecipe: builder.mutation<{ message: string }, string>({
      query: recipeId => ({
        url: `saved-recipes/${recipeId}`,
        method: API_Methods.DELETE,
      }),
      invalidatesTags: ['SavedRecipe'],
    }),

    // Check if recipe is saved
    checkIfRecipeSaved: builder.query<{ is_saved: boolean }, string>({
      query: recipeId => ({
        url: `saved-recipes/check/${recipeId}`,
        method: API_Methods.GET,
      }),
      providesTags: ['SavedRecipe'],
    }),
  }),
});

export const {
  useSaveRecipeMutation,
  useGetSavedRecipesQuery,
  useRemoveSavedRecipeMutation,
  useCheckIfRecipeSavedQuery,
} = recipeBookmarkApi;

// Types
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

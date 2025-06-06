// frontend/src/redux/services/chefRecipeApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../helpers/baseQuery';
import { API_Methods } from '../helpers/types';

export const chefRecipeApi = createApi({
  reducerPath: 'chefRecipeApi',
  baseQuery: baseQuery,
  tagTypes: ['ChefRecipe', 'ChefRecipeComment'],
  endpoints: builder => ({
    // Get all recipes
    getAllChefRecipes: builder.query<IChefRecipeOverview, void>({
      query: () => ({
        url: 'recipes',
        method: API_Methods.GET,
      }),
      providesTags: ['ChefRecipe'],
    }),

    // Get single recipe detail
    getChefRecipeDetail: builder.query<IChefRecipeDetail, number>({
      query: recipeId => ({
        url: `recipes/${recipeId}`,
        method: API_Methods.GET,
      }),
      providesTags: (result, error, recipeId) => [
        { type: 'ChefRecipe', id: recipeId },
        'ChefRecipeComment',
      ],
    }),

    // Create a new recipe
    createChefRecipe: builder.mutation<
      { message: string; recipeId: number },
      ICreateChefRecipeParams
    >({
      query: params => ({
        url: 'recipes',
        method: API_Methods.POST,
        body: params,
      }),
      invalidatesTags: ['ChefRecipe'],
    }),

    // Update a recipe
    updateChefRecipe: builder.mutation<
      { message: string },
      { recipeId: number } & ICreateChefRecipeParams
    >({
      query: ({ recipeId, ...params }) => ({
        url: `recipes/${recipeId}`,
        method: API_Methods.PUT,
        body: params,
      }),
      invalidatesTags: (result, error, { recipeId }) => [
        'ChefRecipe',
        { type: 'ChefRecipe', id: recipeId },
      ],
    }),

    // Delete a recipe
    deleteChefRecipe: builder.mutation<{ message: string }, number>({
      query: recipeId => ({
        url: `recipes/${recipeId}`,
        method: API_Methods.DELETE,
      }),
      invalidatesTags: ['ChefRecipe'],
    }),

    // Rate a recipe
    rateChefRecipe: builder.mutation<
      { message: string },
      { recipeId: number; rating: number }
    >({
      query: ({ recipeId, rating }) => ({
        url: `recipes/${recipeId}/rate`,
        method: API_Methods.POST,
        body: { rating },
      }),
      invalidatesTags: (result, error, { recipeId }) => [
        { type: 'ChefRecipe', id: recipeId },
      ],
    }),

    // Add comment to recipe
    addChefRecipeComment: builder.mutation<
      IChefRecipeComment,
      { recipeId: number; text: string }
    >({
      query: ({ recipeId, text }) => ({
        url: `recipes/${recipeId}/comments`,
        method: API_Methods.POST,
        body: { text },
      }),
      invalidatesTags: (result, error, { recipeId }) => [
        'ChefRecipeComment',
        { type: 'ChefRecipe', id: recipeId },
      ],
    }),

    // Toggle like on recipe comment
    toggleLikeChefRecipeComment: builder.mutation<{ liked: boolean }, number>({
      query: commentId => ({
        url: `recipes/comments/${commentId}/like`,
        method: API_Methods.POST,
      }),
      invalidatesTags: ['ChefRecipeComment'],
    }),

    // Reply to recipe comment
    replyToChefRecipeComment: builder.mutation<
      IChefRecipeCommentReply,
      { commentId: number; text: string }
    >({
      query: ({ commentId, text }) => ({
        url: `recipes/comments/${commentId}/reply`,
        method: API_Methods.POST,
        body: { text },
      }),
      invalidatesTags: ['ChefRecipeComment'],
    }),
  }),
});

export const {
  useGetAllChefRecipesQuery,
  useGetChefRecipeDetailQuery,
  useCreateChefRecipeMutation,
  useUpdateChefRecipeMutation,
  useDeleteChefRecipeMutation,
  useRateChefRecipeMutation,
  useAddChefRecipeCommentMutation,
  useToggleLikeChefRecipeCommentMutation,
  useReplyToChefRecipeCommentMutation,
} = chefRecipeApi;

// Types
export interface IChefRecipeOverview {
  chefs: IChef[];
  free_recipes: IChefRecipe[];
  premium_recipes: IChefRecipe[];
}

export interface IChef {
  id: number;
  name: string;
  image: string;
  description: string;
}

export interface IChefRecipe {
  id: number;
  user_id: number;
  name: string;
  type: 'free' | 'premium';
  cost: number;
  description: string;
  cooking_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  image: string | null;
  created_at: string;
  full_name: string;
  photo: string | null;
  stars: number;
  review_count: number;
}

export interface IChefRecipeDetail extends IChefRecipe {
  ingredients: IChefRecipeIngredient[];
  directions: IChefRecipeDirection[];
  comments: IChefRecipeComment[];
}

export interface IChefRecipeIngredient {
  name: string;
  quantity: string;
}

export interface IChefRecipeDirection {
  step_number: number;
  instruction: string;
}

export interface IChefRecipeComment {
  id: number;
  user_id: number;
  recipe_id: number;
  text: string;
  created_at: string;
  full_name: string;
  photo: string | null;
  like_count: number;
  replies: IChefRecipeCommentReply[];
}

export interface IChefRecipeCommentReply {
  id: number;
  comment_id: number;
  user_id: number;
  text: string;
  created_at: string;
  full_name: string;
  photo: string | null;
}

export interface ICreateChefRecipeParams {
  name: string;
  type: 'free' | 'premium';
  cost?: number;
  description: string;
  cooking_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  ingredients: {
    name: string;
    quantity: string;
  }[];
  directions: string[];
}

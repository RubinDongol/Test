// frontend/src/redux/services/recipeApi.ts - Updated with your API key
import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Your Spoonacular API Key
const SPOONACULAR_API_KEY = '9ec6add2c1084bebad11951fb21b15bb';

export const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.spoonacular.com/recipes/',
    prepareHeaders: headers => {
      headers.set('x-api-key', SPOONACULAR_API_KEY);
      return headers;
    },
  }),
  tagTypes: ['Recipe'],
  endpoints: builder => ({
    // Get trending/popular recipes
    getTrendingRecipes: builder.query<SpoonacularRecipeResponse, number>({
      query: (limit = 12) => `random?number=${limit}&tags=popular`,
      transformResponse: (response: any) => ({
        recipes: response.recipes.map(transformSpoonacularRecipe),
      }),
    }),

    // Get recipes by cuisine
    getRecipesByCuisine: builder.query<
      SpoonacularRecipeResponse,
      { cuisine: string; limit?: number }
    >({
      query: ({ cuisine, limit = 8 }) => {
        const params = new URLSearchParams({
          cuisine,
          number: limit.toString(),
          addRecipeInformation: 'true',
        });
        return `complexSearch?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        recipes: response.results.map(transformSearchResult),
      }),
    }),

    // Get recipes by diet type
    getRecipesByDiet: builder.query<
      SpoonacularRecipeResponse,
      { diet: string; limit?: number }
    >({
      query: ({ diet, limit = 8 }) => {
        const params = new URLSearchParams({
          diet,
          number: limit.toString(),
          addRecipeInformation: 'true',
        });
        return `complexSearch?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        recipes: response.results.map(transformSearchResult),
      }),
    }),

    // Get recipes by meal type
    getRecipesByType: builder.query<
      SpoonacularRecipeResponse,
      { type: string; limit?: number }
    >({
      query: ({ type, limit = 8 }) => {
        const params = new URLSearchParams({
          type,
          number: limit.toString(),
          addRecipeInformation: 'true',
        });
        return `complexSearch?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        recipes: response.results.map(transformSearchResult),
      }),
    }),

    // Get recipe by ID with detailed information
    getRecipeById: builder.query<DetailedRecipe, number>({
      query: id => `${id}/information?includeNutrition=false`,
      transformResponse: (response: any) => transformDetailedRecipe(response),
    }),

    // Search recipes with multiple filters
    searchRecipes: builder.query<SpoonacularRecipeResponse, SearchRecipeParams>(
      {
        query: ({ query, cuisine, diet, type, intolerances, limit = 12 }) => {
          const params = new URLSearchParams({
            query,
            number: limit.toString(),
            addRecipeInformation: 'true',
            ...(cuisine && { cuisine }),
            ...(diet && { diet }),
            ...(type && { type }),
            ...(intolerances && { intolerances }),
          });
          return `complexSearch?${params.toString()}`;
        },
        transformResponse: (response: any) => ({
          recipes: response.results.map(transformSearchResult),
        }),
      },
    ),

    // Get random recipes with tags
    getRandomRecipesWithTags: builder.query<
      SpoonacularRecipeResponse,
      { tags?: string; limit?: number }
    >({
      query: ({ tags, limit = 8 }) => {
        const params = new URLSearchParams({
          number: limit.toString(),
          ...(tags && { tags }),
        });
        return `random?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        recipes: response.recipes.map(transformSpoonacularRecipe),
      }),
    }),
  }),
});

// Transform Spoonacular recipe to our format (for random endpoint)
const transformSpoonacularRecipe = (recipe: any): RecipeDataType => ({
  id: recipe.id.toString(),
  recipeName: recipe.title,
  reviews: Math.floor(Math.random() * 100),
  imageUrl: recipe.image,
  readyInMinutes: recipe.readyInMinutes,
  servings: recipe.servings,
  sourceUrl: recipe.sourceUrl,
  cuisines: recipe.cuisines || [],
  diets: recipe.diets || [],
  dishTypes: recipe.dishTypes || [],
});

// Transform search results to our format (for complexSearch endpoint)
const transformSearchResult = (recipe: any): RecipeDataType => ({
  id: recipe.id.toString(),
  recipeName: recipe.title,
  reviews: Math.floor(Math.random() * 100),
  imageUrl: recipe.image,
  readyInMinutes: recipe.readyInMinutes,
  servings: recipe.servings,
  sourceUrl: recipe.sourceUrl,
  cuisines: recipe.cuisines || [],
  diets: recipe.diets || [],
  dishTypes: recipe.dishTypes || [],
});

// Transform detailed recipe for recipe detail page
const transformDetailedRecipe = (recipe: any): DetailedRecipe => ({
  id: recipe.id.toString(),
  name: recipe.title,
  image: recipe.image,
  description:
    recipe.summary?.replace(/<[^>]*>/g, '') || 'No description available',
  cookingTime: recipe.readyInMinutes || 30,
  servings: recipe.servings || 4,
  difficulty: recipe.veryPopular
    ? 'Easy'
    : recipe.readyInMinutes > 60
      ? 'Hard'
      : 'Medium',
  rating: (recipe.spoonacularScore || 50) / 20,
  reviewCount: Math.floor(Math.random() * 100),
  isPremium: false,
  chef: recipe.sourceName || 'Unknown Chef',
  tags: [
    ...(recipe.cuisines || []),
    ...(recipe.dishTypes || []),
    ...(recipe.diets || []),
  ],
  ingredients:
    recipe.extendedIngredients?.map((ing: any) => ({
      name: ing.name,
      quantity: `${ing.amount} ${ing.unit}`,
    })) || [],
  directions:
    recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) ||
    [],
  sourceUrl: recipe.sourceUrl,
  cuisines: recipe.cuisines || [],
  diets: recipe.diets || [],
  dishTypes: recipe.dishTypes || [],
});

export const {
  useGetTrendingRecipesQuery,
  useGetRecipesByCuisineQuery,
  useGetRecipesByDietQuery,
  useGetRecipesByTypeQuery,
  useGetRecipeByIdQuery,
  useSearchRecipesQuery,
  useGetRandomRecipesWithTagsQuery,
} = recipeApi;

// Types
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

export interface SpoonacularRecipeResponse {
  recipes: RecipeDataType[];
}

export interface SearchRecipeParams {
  query: string;
  cuisine?: string;
  diet?: string;
  type?: string;
  intolerances?: string;
  limit?: number;
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

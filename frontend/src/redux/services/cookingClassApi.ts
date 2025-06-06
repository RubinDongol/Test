// frontend/src/redux/services/cookingClassApi.ts - Updated with proper payment types
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../helpers/baseQuery';
import { API_Methods } from '../helpers/types';

export const cookingClassApi = createApi({
  reducerPath: 'cookingClassApi',
  baseQuery: baseQuery,
  tagTypes: ['CookingClass'],
  endpoints: builder => ({
    // Get all cooking classes
    getAllCookingClasses: builder.query<ICookingClass[], void>({
      query: () => ({
        url: 'cooking-classes',
        method: API_Methods.GET,
      }),
      providesTags: ['CookingClass'],
    }),

    // Get single cooking class by ID
    getCookingClassById: builder.query<ICookingClass, number>({
      query: classId => ({
        url: `cooking-classes/${classId}`,
        method: API_Methods.GET,
      }),
      providesTags: (result, error, classId) => [
        { type: 'CookingClass', id: classId },
      ],
    }),

    // Create a new cooking class
    createCookingClass: builder.mutation<
      { message: string; classId: number },
      ICreateCookingClassParams
    >({
      query: params => ({
        url: 'cooking-classes',
        method: API_Methods.POST,
        body: params,
      }),
      invalidatesTags: ['CookingClass'],
    }),

    // Delete a cooking class
    deleteCookingClass: builder.mutation<{ message: string }, number>({
      query: classId => ({
        url: `cooking-classes/${classId}`,
        method: API_Methods.DELETE,
      }),
      invalidatesTags: ['CookingClass'],
    }),

    // Rate a cooking class
    rateCookingClass: builder.mutation<
      { message: string },
      { classId: number; rating: number; comment?: string }
    >({
      query: ({ classId, rating, comment }) => ({
        url: `cooking-classes/${classId}/rate`,
        method: API_Methods.POST,
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: 'CookingClass', id: classId },
        'CookingClass', // Also invalidate the list
      ],
    }),

    // Update payment status - Enhanced with better error handling
    updatePaymentStatus: builder.mutation<
      { message: string; payment_done: boolean },
      { classId: number; payment_done: boolean }
    >({
      query: ({ classId, payment_done }) => ({
        url: `cooking-classes/${classId}/payment`,
        method: API_Methods.PATCH,
        body: { payment_done },
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: 'CookingClass', id: classId },
        'CookingClass', // Also invalidate the list to refresh all data
      ],
      // Transform the response to include the payment status
      transformResponse: (response: any, meta, arg) => ({
        message: response.message || 'Payment status updated successfully',
        payment_done: arg.payment_done,
      }),
      // Handle errors appropriately
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to update payment status',
        status: response?.status,
      }),
    }),
  }),
});

export const {
  useGetAllCookingClassesQuery,
  useGetCookingClassByIdQuery,
  useCreateCookingClassMutation,
  useDeleteCookingClassMutation,
  useRateCookingClassMutation,
  useUpdatePaymentStatusMutation,
} = cookingClassApi;

// Enhanced Types with better payment handling
export interface ICookingClass {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  class_date: string;
  class_time: string;
  max_students: number;
  difficulty: 'easy' | 'medium' | 'hard';
  learn: string[];
  requirements: string[];
  category: string;
  tags: string[];
  chef_notes: string;
  course_fee: number;
  image: string;
  live_link: string;
  payment_done: boolean; // This is the key field for payment status
  created_at: string;
  full_name: string; // Chef name
  photo: string | null; // Chef photo
  stars: number;
  review_count: number;
}

export interface ICreateCookingClassParams {
  title: string;
  description: string;
  price: number;
  duration: number;
  class_date: string;
  class_time: string;
  max_students: number;
  difficulty: 'easy' | 'medium' | 'hard';
  learn: string[];
  requirements: string[];
  category?: string;
  tags?: string[];
  chef_notes?: string;
  course_fee?: number;
  image?: string;
}

// Additional types for payment handling
export interface IPaymentStatusUpdate {
  classId: number;
  payment_done: boolean;
}

export interface IPaymentStatusResponse {
  message: string;
  payment_done: boolean;
}

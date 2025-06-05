// frontend/src/redux/services/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../helpers/baseQuery';
import { API_Methods } from '../helpers/types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery,
  tagTypes: ['User', 'Follow'],
  endpoints: builder => ({
    // Follow a user
    followUser: builder.mutation<{ message: string }, number>({
      query: userId => ({
        url: `users/${userId}/follow`,
        method: API_Methods.POST,
      }),
      invalidatesTags: ['Follow'],
    }),

    // Unfollow a user
    unfollowUser: builder.mutation<{ message: string }, number>({
      query: userId => ({
        url: `users/${userId}/unfollow`,
        method: API_Methods.DELETE,
      }),
      invalidatesTags: ['Follow'],
    }),

    // Get user profile
    getUserProfile: builder.query<IUserProfile, void>({
      query: () => ({
        url: 'auth/profile',
        method: API_Methods.GET,
      }),
      providesTags: ['User'],
    }),

    // Update user profile
    updateProfile: builder.mutation<IUserProfile, IUpdateProfileParams>({
      query: params => ({
        url: 'auth/profile',
        method: API_Methods.PUT,
        body: params,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} = userApi;

export interface IUserProfile {
  id: number;
  full_name: string;
  email: string;
  role_id: number;
  address: string;
  bio: string;
  photo: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  posts: any[];
}

export interface IUpdateProfileParams {
  full_name?: string;
  address?: string;
  bio?: string;
  photo?: string;
}

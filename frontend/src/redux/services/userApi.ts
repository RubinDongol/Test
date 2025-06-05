// frontend/src/redux/services/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../helpers/baseQuery';
import { API_Methods } from '../helpers/types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery,
  tagTypes: ['User', 'Follow', 'Post'],
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

    // Get current user profile
    getUserProfile: builder.query<IUserProfile, void>({
      query: () => ({
        url: 'auth/profile',
        method: API_Methods.GET,
      }),
      providesTags: result => [
        'User',
        { type: 'User', id: 'CURRENT' },
        ...(result ? [{ type: 'User' as const, id: result.id }] : []),
      ],
    }),

    // Get specific user profile by ID
    getUserProfileById: builder.query<IUserProfile, number>({
      query: userId => ({
        url: `auth/profile/${userId}`,
        method: API_Methods.GET,
      }),
      providesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
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
  useGetUserProfileByIdQuery, // Add this export
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
  posts: IUserPost[];
}

export interface IUserPost {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_bookmarked: boolean;
  is_liked: boolean;
}

export interface IUpdateProfileParams {
  full_name?: string;
  address?: string;
  bio?: string;
  photo?: string;
}

// frontend/src/redux/services/postApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../helpers/baseQuery';
import { API_Methods } from '../helpers/types';

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: baseQuery,
  tagTypes: ['Post', 'Comment', 'User'],
  endpoints: builder => ({
    // Create a new post
    createPost: builder.mutation<IPost, { content: string }>({
      query: params => ({
        url: 'posts',
        method: API_Methods.POST,
        body: params,
      }),
      invalidatesTags: [
        'Post',
        'User',
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'CURRENT' },
      ],
    }),

    // Get all posts (For You feed)
    getAllPosts: builder.query<IPost[], void>({
      query: () => ({
        url: 'posts',
        method: API_Methods.GET,
      }),
      providesTags: ['Post'],
    }),

    // Get posts from followed users
    getFollowingPosts: builder.query<IPost[], void>({
      query: () => ({
        url: 'posts/following',
        method: API_Methods.GET,
      }),
      providesTags: ['Post'],
    }),

    // Get bookmarked posts
    getBookmarkedPosts: builder.query<IPost[], void>({
      query: () => ({
        url: 'posts/bookmarked',
        method: API_Methods.GET,
      }),
      providesTags: ['Post'],
    }),

    // Toggle like on a post
    toggleLikePost: builder.mutation<
      { liked: boolean; message: string },
      number
    >({
      query: postId => ({
        url: `posts/${postId}/like`,
        method: API_Methods.POST,
      }),
      invalidatesTags: (result, error, postId) => [
        'Post',
        'User',
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'CURRENT' },
      ],
    }),

    // Toggle bookmark on a post
    toggleBookmarkPost: builder.mutation<
      { bookmarked: boolean; message: string },
      number
    >({
      query: postId => ({
        url: `posts/${postId}/bookmark`,
        method: API_Methods.POST,
      }),
      invalidatesTags: (result, error, postId) => [
        'Post',
        'User',
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'CURRENT' },
      ],
    }),

    // Add comment to a post
    addComment: builder.mutation<IComment, { postId: number; text: string }>({
      query: ({ postId, text }) => ({
        url: `posts/${postId}/comment`,
        method: API_Methods.POST,
        body: { text },
      }),
      invalidatesTags: (result, error, { postId }) => [
        'Comment',
        'Post',
        'User',
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'CURRENT' },
      ],
    }),

    // Get comments for a post
    getCommentsByPostId: builder.query<IComment[], number>({
      query: postId => ({
        url: `posts/${postId}/comments`,
        method: API_Methods.GET,
      }),
      providesTags: ['Comment'],
    }),

    // Delete a post
    deletePost: builder.mutation<{ message: string }, number>({
      query: postId => ({
        url: `posts/${postId}`,
        method: API_Methods.DELETE,
      }),
      invalidatesTags: (result, error, postId) => [
        'Post',
        'User',
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'CURRENT' },
      ],
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          postApi.util.updateQueryData('getAllPosts', undefined, draft => {
            return draft.filter(post => post.id !== postId);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          // If the mutation fails, undo the optimistic update
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetAllPostsQuery,
  useGetFollowingPostsQuery,
  useGetBookmarkedPostsQuery,
  useToggleLikePostMutation,
  useToggleBookmarkPostMutation,
  useAddCommentMutation,
  useGetCommentsByPostIdQuery,
  useDeletePostMutation,
} = postApi;

export interface IPost {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  full_name: string;
  photo: string | null;
  like_count: number;
  comment_count: number;
  is_bookmarked: boolean;
  is_liked: boolean;
  is_owner: boolean;
}

export interface IComment {
  id: number;
  user_id: number;
  post_id: number;
  text: string;
  created_at: string;
  full_name: string;
  photo: string | null;
}

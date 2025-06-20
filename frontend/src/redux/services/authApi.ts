// frontend/src/redux/services/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../helpers/baseQuery';
import { API_Methods } from '../helpers/types';
import { saveAccessToken, saveUser } from '../reducers/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  tagTypes: ['User'],
  endpoints: builder => ({
    login: builder.mutation<IUser, LoginParams>({
      query: params => ({
        url: 'auth/login',
        method: API_Methods.POST,
        body: params,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            dispatch(saveUser(data));
            dispatch(saveAccessToken(data.token));
          }
        } catch (error) {
          console.log('Error on login:', error);
        }
      },
    }),

    signup: builder.mutation<IUser, SignupParams>({
      query: params => ({
        url: 'auth/register',
        method: API_Methods.POST,
        body: params,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            dispatch(saveUser(data));
          }
        } catch (error) {
          console.log('Error on register:', error);
        }
      },
    }),

    forgotPassword: builder.mutation<any, string>({
      query: email => ({
        url: 'auth/forgot-password',
        method: API_Methods.POST,
        body: { email },
      }),
    }),

    verifyOtp: builder.mutation<any, { email: string; otp: string }>({
      query: ({ email, otp }) => ({
        url: 'auth/verify-otp',
        method: API_Methods.POST,
        body: { email, otp },
      }),
    }),

    verifyForgotOtp: builder.mutation<any, { email: string; otp: string }>({
      query: ({ email, otp }) => ({
        url: 'auth/verify-password-otp',
        method: API_Methods.POST,
        body: { email, otp },
      }),
    }),

    resendOtp: builder.mutation<any, string>({
      query: email => ({
        url: 'auth/resend-otp',
        method: API_Methods.POST,
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<
      any,
      { email: string; newPassword: string }
    >({
      query: ({ email, newPassword }) => ({
        url: 'auth/reset-password',
        method: API_Methods.POST,
        body: { email, newPassword },
      }),
    }),

    getProfile: builder.query<IUserProfile, void>({
      query: () => ({
        url: 'auth/profile',
        method: API_Methods.GET,
      }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<IUserProfile, IUpdateProfileParams>({
      query: params => ({
        url: 'auth/profile',
        method: API_Methods.PUT,
        body: params,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(saveUser(data as any));
        } catch (error) {
          console.log('Error updating profile:', error);
        }
      },
    }),

    logout: builder.mutation<null, void>({
      query: () => ({
        url: 'auth/logout',
        method: API_Methods.POST,
      }),
    }),

    getRoles: builder.query<{ id: number; name: string }[], void>({
      query: () => ({
        url: 'roles',
        method: API_Methods.GET,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetRolesQuery,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: IUser;
}

export interface IUser {
  id: number;
  full_name: string;
  email: string;
  address: string;
  bio: string;
  photo: string | null;
  role_id: number;
  token: string;
  created_at: string;
  updated_at: string;
}

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

export interface SignupParams {
  email: string;
  full_name: string;
  password: string;
  role_id: number;
  address: string;
  bio: string;
}

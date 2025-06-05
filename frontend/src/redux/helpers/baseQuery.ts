// frontend/src/redux/helpers/baseQuery.ts - Alternative type-safe version
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { logout, setErrorMessage } from '../reducers/auth';

const DEFAULT_TIMEOUT = 15000;

const baseQueryForUrl = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api/',
  timeout: DEFAULT_TIMEOUT,
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryForUrl(args, api, extraOptions);

  if (result.error) {
    const { error } = result;

    // Handle 401 Unauthorized
    if (
      error.status === 401 &&
      !result.meta?.request?.url?.includes('register') &&
      !result.meta?.request?.url?.includes('login')
    ) {
      api.dispatch(logout());
      return result;
    }

    // Handle other errors
    let errorMessage = 'Server Error';

    if (error.status === 'TIMEOUT_ERROR') {
      errorMessage = 'Request timed out!';
    } else if (
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data
    ) {
      errorMessage = (error.data as { message: string }).message;
    }

    api.dispatch(setErrorMessage(errorMessage));
  }

  return result;
};

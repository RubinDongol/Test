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
  prepareHeaders: async headers => {
    const token = '';
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
  const error = result?.error;
  if (error) {
    if (
      error.status === 401 &&
      !result.meta?.request?.url?.includes('register') &&
      !result.meta?.request?.url?.includes('login')
    ) {
      api.dispatch(logout());
    } else {
      const errorMsg = error?.data?.message;
      if (errorMsg) {
        api.dispatch(setErrorMessage(errorMsg));
      } else {
        if (error?.status === 'TIMEOUT_ERROR') {
          return api.dispatch(setErrorMessage('Request timed out!'));
        }
        api.dispatch(setErrorMessage('Server Error'));
      }
    }
  }
  return result;
};

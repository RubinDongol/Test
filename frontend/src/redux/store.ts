// frontend/src/redux/store.ts
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import { authApi } from './services/authApi';
import { postApi } from './services/postApi';
import { userApi } from './services/userApi';

const reducers = combineReducers({
  //all slices
  auth: authReducer,
  //all apis
  [authApi.reducerPath]: authApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  blackList: [
    authApi.reducerPath,
    postApi.reducerPath,
    userApi.reducerPath,
    'bookmark',
    'swipe',
    'user',
    'likedYou',
  ],
};

const rootReducer = (
  state: ReturnType<typeof reducers> | undefined,
  action: { type: string },
) => {
  if (action.type === 'LOGOUT') {
    // Reset all state to initial state on logout
    state = undefined;
  }
  return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([authApi.middleware, postApi.middleware, userApi.middleware]),
  devTools: import.meta.env.VITE_APP_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

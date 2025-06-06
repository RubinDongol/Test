// frontend/src/redux/store.ts - Updated with cooking class API
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import { authApi } from './services/authApi';
import { postApi } from './services/postApi';
import { userApi } from './services/userApi';
import { recipeApi } from './services/recipeApi';
import { chefRecipeApi } from './services/chefRecipeApi';
import { recipeBookmarkApi } from './services/recipeBookmarkApi';
import { cookingClassApi } from './services/cookingClassApi'; // Add this import

const reducers = combineReducers({
  //all slices
  auth: authReducer,
  //all apis
  [authApi.reducerPath]: authApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [recipeApi.reducerPath]: recipeApi.reducer,
  [chefRecipeApi.reducerPath]: chefRecipeApi.reducer,
  [recipeBookmarkApi.reducerPath]: recipeBookmarkApi.reducer,
  [cookingClassApi.reducerPath]: cookingClassApi.reducer, // Add this line
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  blackList: [
    authApi.reducerPath,
    postApi.reducerPath,
    userApi.reducerPath,
    recipeApi.reducerPath,
    chefRecipeApi.reducerPath,
    recipeBookmarkApi.reducerPath,
    cookingClassApi.reducerPath, // Add this line
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
    }).concat([
      authApi.middleware,
      postApi.middleware,
      userApi.middleware,
      recipeApi.middleware,
      chefRecipeApi.middleware,
      recipeBookmarkApi.middleware,
      cookingClassApi.middleware, // Add this line
    ]),
  devTools: import.meta.env.VITE_APP_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

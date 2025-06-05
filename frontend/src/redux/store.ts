import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import { authApi } from './services/authApi';

const reducers = combineReducers({
  //all slices
  auth: authReducer,
  //all apis
  [authApi.reducerPath]: authApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  blackList: [authApi.reducerPath, 'bookmark', 'swipe', 'user', 'likedYou'],
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
    }).concat([authApi.middleware]),
  devTools: import.meta.env.VITE_APP_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../services/authApi';

const initialState = {
  accessToken: null as string | null,
  user: {} as IUser,
  errorMessage: null as string | null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    saveAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    saveUser(state, action: PayloadAction<IUser>) {
      const { token, ...user } = action.payload;
      state.user = {
        ...state.user,
        ...user,
      };
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    resetAuthData() {
      return initialState;
    },
  },
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const { saveUser, resetAuthData, saveAccessToken, setErrorMessage } =
  authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
export interface IAuthData {
  accessToken: string;
  user: IUser;
}

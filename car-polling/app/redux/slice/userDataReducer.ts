import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  user_name: string;
  email: string;
  image: string;
  IsAdmin: Boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserAndToken(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUserAndToken(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUserImage(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.image = action.payload;
      }
    },
  },
});

export const { setUserAndToken, clearUserAndToken, updateUserImage } =
  authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;

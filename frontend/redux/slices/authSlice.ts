import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMe, loginUser, logoutUser, registerUser } from '@/api/auth';
import { AuthState, User } from '@/types/auth';
import { getErrorMessage } from '@/utils/errors';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await getMe();
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Failed to fetch user'));
  }
});

export const login = createAsyncThunk(
  'auth/jwt/create/',
  async (
    payload: { email: string; password: string; remember_me?: boolean },
    { rejectWithValue }
  ) => {
    try {
      await loginUser(payload);
      return await getMe();
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err, 'Login failed'));
    }
  }
);

export const register = createAsyncThunk(
  'auth/users/',
  async (
    payload: { email: string; password: string; re_password: string; first_name?: string; last_name?: string },
    { rejectWithValue }
  ) => {
    try {
      await registerUser(payload);
      return null; // do not fetchMe when activation is required
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err, 'Register failed'));
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
    return true;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Logout failed'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;

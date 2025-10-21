import { AuthState, User } from '@/types/types';
import { fetchJSON, loadLocal, saveLocal } from '@/utils/storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("currentUser") || "null"), // Load user from localStorage
    token: localStorage.getItem("token"), // Load token from localStorage
    status: "idle",
    error: null,
};

export const signUp = createAsyncThunk<
  User,
  { email: string; password: string; firstName: string; lastName: string },
  { rejectValue: string }
>('auth/signUp', async (body, { rejectWithValue }) => {
  try {
    const jsonUsers = await fetchJSON<User[]>('/data/users.json');
    const localUsers = loadLocal<User>('users');
    const all = [...localUsers,...jsonUsers];
    if (all.find(u => u.email === body.email)) throw new Error('Email already exists');
    const newUser: User = { ...body, userId: uuidv4(), role: 'CLIENT' };
    saveLocal('users', [...localUsers, newUser]);
    return newUser;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const updateUser = createAsyncThunk<User, { userId: string; email: string; firstName: string; lastName: string }, { rejectValue: string }>('auth/updateUser', async({ userId, email, firstName, lastName }, { rejectWithValue }) => {
  try {
    const jsonUsers = await fetchJSON<User[]>('/data/users.json');
    const localUsers = loadLocal<User>('users');
    const all = [...localUsers,...jsonUsers];
    const userIndex = all.findIndex(u => u.userId === userId);
    if (userIndex === -1) throw new Error('User not found');
    const updatedUser: User = { ...all[userIndex], email, firstName, lastName };
    console.log(updateUser)
    all[userIndex] = updatedUser;
    saveLocal('users', all);
    // localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
})


export const signIn = createAsyncThunk<
  Omit<User, 'password'> & { token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/signIn', async ({ email, password }, { rejectWithValue }) => {
  try {
    const jsonUsers = await fetchJSON<User[]>('/data/users.json');
    const localUsers = loadLocal<User>('users');
    const all = [...localUsers,...jsonUsers];
    const user = all.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const token = btoa(`${user.userId}:${Date.now()}`);
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    const { password: _, ...profile } = user;
    return { ...profile, token };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signUp.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(signUp.fulfilled, state => { state.status = 'succeeded'; })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message!;
      })

      .addCase(signIn.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<Omit<User, 'password'> & { token: string }>) => {
        state.status = 'succeeded';
        state.user = { userId: action.payload.userId, email: action.payload.email, firstName: action.payload.firstName, lastName: action.payload.lastName, role: action.payload.role };
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message!;
      })
      .addCase(updateUser.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = { userId: action.payload.userId, email: action.payload.email, firstName: action.payload.firstName, lastName: action.payload.lastName, role: action.payload.role };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message!;
      })
  }
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;

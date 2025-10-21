// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchJSON, loadLocal, saveLocal } from '@/utils/storage';
import { ChangePasswordPayload, ChangePasswordResponse, PersonalInfo, User } from '@/types/types';

interface UserState {
  allUsers: User[];
  agents: User[];
  userDetails: PersonalInfo | null;
  changePasswordResult: ChangePasswordResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  // initialize the all users with users.json file
  allUsers: await fetchJSON<User[]>('/data/users.json').then(users => users),
  agents: [],
  userDetails: null,
  changePasswordResult: null,
  status: 'idle',
  error: null,
};

function mergeUsers(json: User[], local: User[]): User[] {
  // 1) map JSON → either the local override or the original:
  const patched = json.map(u => {
    const override = local.find(l => l.userId === u.userId);
    return override ?? u;
  });
  // 2) plus any new locals not in JSON:
  const news = local.filter(l => !json.some(u => u.userId === l.userId));
  return [...patched, ...news];
}

function mergePersonalInfo(
  json: PersonalInfo[],
  local: PersonalInfo[]
): PersonalInfo[] {
  // 1) For every entry in your shipped JSON, prefer the local‐override if present:
  const patched = json.map(info => {
    const override = local.find(l => l.clientId === info.clientId);
    return override ?? info;
  });

  // 2) Then add any wholly new local entries not in JSON:
  const news = local.filter(
    l => !json.some(info => info.clientId === l.clientId)
  );

  return [...patched, ...news];
}

// Fetch all users
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
  const json = await fetchJSON<User[]>('/data/users.json');
  const local = loadLocal<User>('users');
  return mergeUsers(json, local);
});

// Fetch detailed info of a user
export const fetchUserDetails = createAsyncThunk<PersonalInfo, string>(
  'users/fetchUserDetails',
  async (userId) => {
    const json = await fetchJSON<PersonalInfo[]>('/data/personalInfo.json');
    const local = loadLocal<PersonalInfo>('personalInfo');
    const allInfo = mergePersonalInfo(json, local);
    const info = allInfo.find(info => info.clientId === userId);
    if (!info) throw new Error('User info not found');
    return info;
  }
);

// Update user personal info
export const updateUserPersonalInfo = createAsyncThunk<PersonalInfo, PersonalInfo>(
  'users/updateUserPersonalInfo',
  async (newInfo) => {
    const json = await fetchJSON<PersonalInfo[]>('/data/personalInfo.json');
    const local = loadLocal<PersonalInfo>('personalInfo');
    const updated = mergePersonalInfo(json, local).filter(info => info.clientId !== newInfo.clientId);
    saveLocal('personalInfo', [...updated, newInfo]);
    return newInfo;
  }
);

// Change password
// Change password
export const changePassword = createAsyncThunk<ChangePasswordResponse, ChangePasswordPayload>(
  'users/changePassword',
  async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const json = await fetchJSON<User[]>('/data/users.json');
      const local = loadLocal<User>('users');
      const allUsers = [...json, ...local];
      const user = allUsers.find(u => u.userId === userId);
      if (!user) throw new Error('User not found');
      console.log(user.password !== oldPassword)
      if (user.password !== oldPassword) throw new Error('Incorrect old password');
      const updatedUser = { ...user, password: newPassword };
      const updatedLocal = [...local.filter(u => u.userId !== userId), updatedUser];
      saveLocal('users', updatedLocal);
      const response: ChangePasswordResponse = {
        idToken: localStorage.getItem('token') || '',
        role: user.role,
        userId: user.userId,
        userImageUrl: "",
        username: user.email,
      };
 
 
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch all support agents
export const fetchAgents = createAsyncThunk<User[]>('users/fetchAgents', async () => {
  const json = await fetchJSON<User[]>('/data/users.json');
  const local = loadLocal<User>('users');
  const allUsers = mergeUsers(json, local);
  return allUsers.filter(user => user.role === 'SUPPORT_AGENT');
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        
        state.allUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })

      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<PersonalInfo>) => {
        state.userDetails = action.payload;
      })

      .addCase(updateUserPersonalInfo.fulfilled, (state, action: PayloadAction<PersonalInfo>) => {
        state.userDetails = action.payload;
      })

      .addCase(changePassword.fulfilled, (state, action: PayloadAction<ChangePasswordResponse>) => {
        state.changePasswordResult = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordResult = null;
        state.error = action.error.message || 'Failed to change password';
      })
      .addCase(fetchAgents.pending, state => { state.status = 'loading'; })


      .addCase(fetchAgents.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.agents = action.payload;
      });
  }
});

export default userSlice.reducer;


// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { fetchJSON, loadLocal, saveLocal } from '@/utils/storage';
// import { ChangePasswordPayload, ChangePasswordResponse, PersonalInfo, User } from '@/types/types';
 
// interface UserState {
//   allUsers: User[];
//   agents: User[];
//   userDetails: PersonalInfo | null;
//   changePasswordResult: ChangePasswordResponse | null;
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }
 
// const initialState: UserState = {
//   // initialize the all users with users.json file
//   allUsers: await fetchJSON<User[]>('/data/users.json').then(users => users),
//   agents: [],
//   userDetails: null,
//   changePasswordResult: null,
//   status: 'idle',
//   error: null,
// };
 
// // Fetch all users
// export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
//   const json = await fetchJSON<User[]>('/data/users.json');
//   const local = loadLocal<User>('users');
//   return [...json, ...local];
// });
 
// // Fetch detailed info of a user
// export const fetchUserDetails = createAsyncThunk<PersonalInfo, string>(
//   'users/fetchUserDetails',
//   async (userId) => {
//     const json = await fetchJSON<PersonalInfo[]>('/data/personalInfo.json');
//     const local = loadLocal<PersonalInfo>('personalInfo');
//     const allInfo = [...json, ...local];
//     const info = allInfo.find(info => info.clientId === userId);
//     if (!info) throw new Error('User info not found');
//     return info;
//   }
// );
 
// // Update user personal info
// export const updateUserPersonalInfo = createAsyncThunk<PersonalInfo, PersonalInfo>(
//   'users/updateUserPersonalInfo',
//   async (newInfo) => {
//     const json = await fetchJSON<PersonalInfo[]>('/data/personalInfo.json');
//     const local = loadLocal<PersonalInfo>('personalInfo');
//     const updated = [...json, ...local].filter(info => info.clientId !== newInfo.clientId);
//     saveLocal('personalInfo', [...updated, newInfo]);
//     return newInfo;
//   }
// );
 
// // Change password
// export const changePassword = createAsyncThunk<ChangePasswordResponse, ChangePasswordPayload>(
//   'users/changePassword',
//   async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
//     try {
//       const json = await fetchJSON<User[]>('/data/users.json');
//       const local = loadLocal<User>('users');
//       const allUsers = [...json, ...local];
//       const user = allUsers.find(u => u.userId === userId);
//       const personalInfo = loadLocal<PersonalInfo>('personalInfo').find(info => info.clientId === userId);
//         if (!personalInfo) throw new Error('User personal info not found');
//       if (!user) throw new Error('User not found');
//       if (user.password !== oldPassword) throw new Error('Incorrect old password');
 
//       const updatedUser = { ...user, password: newPassword };
//       const updatedLocal = [...local.filter(u => u.userId !== userId), updatedUser];
//       saveLocal('users', updatedLocal);
//       const response: ChangePasswordResponse = {
//         idToken: localStorage.getItem('token') || '',
//         role: user.role,
//         userId: user.userId,
//         userImageUrl: personalInfo.imageUrl,
//         username: user.email,
//       };
 
 
//       return response ;
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );
 
// // Fetch all support agents
// export const fetchAgents = createAsyncThunk<User[]>('users/fetchAgents', async () => {
//   const json = await fetchJSON<User[]>('/data/users.json');
//   const local = loadLocal<User>('users');
//   const allUsers = [...json, ...local];
//   return allUsers.filter(user => user.role === 'SUPPORT_AGENT');
// });
 
// const userSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchUsers.pending, state => { state.status = 'loading'; })
//       .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
//         state.status = 'succeeded';
//         state.allUsers = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || 'Failed to fetch users';
//       })
 
//       .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<PersonalInfo>) => {
//         state.userDetails = action.payload;
//       })

 
//       .addCase(updateUserPersonalInfo.fulfilled, (state, action: PayloadAction<PersonalInfo>) => {
//         state.userDetails = action.payload;
//       })
 
//       .addCase(changePassword.fulfilled, (state, action: PayloadAction<ChangePasswordResponse>) => {
//         state.changePasswordResult = action.payload;
//       })
//       .addCase(changePassword.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || 'Failed to change password';
//         state.changePasswordResult = null;
//       })
//       .addCase(fetchAgents.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || 'Failed to fetch agents';
//       })
 
//       .addCase(fetchAgents.fulfilled, (state, action: PayloadAction<User[]>) => {
//         state.agents = action.payload;
//       });
//   }
// });




 
// export default userSlice.reducer;
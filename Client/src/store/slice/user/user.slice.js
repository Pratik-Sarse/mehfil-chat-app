import { createSlice } from "@reduxjs/toolkit";
import {
  getOtherUsersThunk,
  getUserProfileThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
} from "./user.thunk";

const initialState = {
  isAuthenticated: false,
  userProfile: null,
  otherUsers: null,
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
  buttonLoading: false,
  screenLoading: true,

  // Temporary unread badge
  unreadCounts: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem(
        "selectedUser",
        JSON.stringify(action.payload)
      );

      state.selectedUser = action.payload;

      // Chat open hote hi unread clear
      if (action.payload?._id) {
        state.unreadCounts[action.payload._id] = 0;
      }
    },

    incrementUnread: (state, action) => {
      const senderId = action.payload;

      state.unreadCounts[senderId] =
        (state.unreadCounts[senderId] || 0) + 1;
    },

    clearUnread: (state, action) => {
      state.unreadCounts[action.payload] = 0;
    },
  },

  extraReducers: (builder) => {
    // login user
    builder.addCase(loginUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });

    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });

    builder.addCase(loginUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // register user
    builder.addCase(registerUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });

    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });

    builder.addCase(registerUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // logout user
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.unreadCounts = {};
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.clear();
    });

    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // get profile
    builder.addCase(getUserProfileThunk.pending, (state) => {
      state.screenLoading = true;
    });

    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.screenLoading = false;
      state.userProfile = action.payload?.responseData;
    });

    builder.addCase(getUserProfileThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    // get other users
    builder.addCase(getOtherUsersThunk.pending, (state) => {
      state.screenLoading = true;
    });

    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.otherUsers = action.payload?.responseData;
    });

    builder.addCase(getOtherUsersThunk.rejected, (state) => {
      state.screenLoading = false;
    });
  },
});

export const {
  setSelectedUser,
  incrementUnread,
  clearUnread,
} = userSlice.actions;

export default userSlice.reducer;
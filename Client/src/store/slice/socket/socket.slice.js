import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  socket: null,
  onlineUsers: null,
  typingUser: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      const socket = io(import.meta.env.VITE_DB_ORIGIN, {
        query: {
          userId: action.payload,
        },
      });

      state.socket = socket;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setTypingUser: (state, action) => {
      state.typingUser = action.payload;
    },
  },
});

export const {
  initializeSocket,
  setOnlineUsers,
  setTypingUser,
} = socketSlice.actions;

export default socketSlice.reducer;
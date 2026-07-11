import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  socket: null,
  onlineUsers: [],
  typingUser: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      // Purana socket disconnect karo
      if (state.socket) {
        state.socket.disconnect();
      }

      const socket = io(import.meta.env.VITE_DB_ORIGIN, {
        query: {
          userId: action.payload,
        },

        transports: ["websocket"],

        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,

        autoConnect: true,
      });

      socket.on("connect", () => {
        console.log("✅ Socket Connected:", socket.id);
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ Socket Disconnected:", reason);
      });

      socket.on("reconnect", (attempt) => {
        console.log("🔄 Socket Reconnected:", attempt);
      });

      socket.on("connect_error", (err) => {
        console.log("🚨 Socket Error:", err.message);
      });

      state.socket = socket;
    },

    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }

      state.socket = null;
      state.onlineUsers = [];
      state.typingUser = null;
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
  disconnectSocket,
  setOnlineUsers,
  setTypingUser,
} = socketSlice.actions;

export default socketSlice.reducer;
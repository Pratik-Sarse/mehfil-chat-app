import { createSlice } from "@reduxjs/toolkit";
import {
  getMessageThunk,
  sendMessageThunk,
  deleteMessageThunk,
} from "./message.thunk";

const initialState = {
  buttonLoading: false,
  screenLoading: false,
  messages: null,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // New Message
    setNewMessage: (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload];
    },

    // Socket se delete hua message ko mark karo
    setMessageDeleted: (state, action) => {
      const { messageId, deletedBy, deletedAt } = action.payload;
      state.messages = (state.messages || []).map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              isDeleted: true,
              message: "This message was deleted",
              deletedBy,
              deletedAt,
            }
          : msg
      );
    },
  },

  extraReducers: (builder) => {
    // ==========================
    // Send Message
    // ==========================
    builder.addCase(sendMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });

    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload?.responseData];
      state.buttonLoading = false;
    });

    builder.addCase(sendMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // ==========================
    // Get Messages
    // ==========================
    builder.addCase(getMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });

    builder.addCase(getMessageThunk.fulfilled, (state, action) => {
      state.messages = action.payload?.responseData?.messages ?? [];
      state.buttonLoading = false;
    });

    builder.addCase(getMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // ==========================
    // Delete Message
    // ==========================
    builder.addCase(deleteMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });

    builder.addCase(deleteMessageThunk.fulfilled, (state, action) => {
      const payload = action.payload?.responseData;

      if (payload?.messageId) {
        state.messages = (state.messages || []).map((msg) =>
          msg._id === payload.messageId
            ? {
                ...msg,
                isDeleted: true,
                message: "This message was deleted",
                deletedBy: payload.deletedBy,
                deletedAt: payload.deletedAt,
              }
            : msg
        );
      }

      state.buttonLoading = false;
    });

    builder.addCase(deleteMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });
  },
});

export const {
  setNewMessage,
  setMessageDeleted,
} = messageSlice.actions;

export default messageSlice.reducer;
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utitlities/axiosInstance";

// ==========================
// Send Message
// ==========================
export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ recieverId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/message/send/${recieverId}`,
        {
          message,
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

// ==========================
// Get Messages
// ==========================
export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ recieverId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/message/get-messages/${recieverId}`
      );

      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

// ==========================
// Delete Message
// ==========================
export const deleteMessageThunk = createAsyncThunk(
  "message/delete",
  async ({ messageId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/message/delete/${messageId}`
      );

      toast.success("Message deleted");

      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;

      toast.error(errorOutput);

      return rejectWithValue(errorOutput);
    }
  }
);
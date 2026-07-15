import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlware.js";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Send Message
router.post("/send/:receiverId", isAuthenticated, sendMessage);

// Get Messages
router.get("/get-messages/:otherParticipantId", isAuthenticated, getMessages);

// Delete Single Message
router.delete("/delete/:messageId", isAuthenticated, deleteMessage);

export default router;
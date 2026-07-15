import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { getSocketId, io } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message) {
    return next(new errorHandler("All fields are required", 400));
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  conversation.messages.push(newMessage._id);
  await conversation.save();

  // Socket.IO
  const socketId = getSocketId(receiverId);

  if (socketId) {
    io.to(socketId).emit("newMessage", newMessage);
  }

  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
});

export const getMessages = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const otherParticipantId = req.params.otherParticipantId;

  if (!myId || !otherParticipantId) {
    return next(new errorHandler("All fields are required", 400));
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  }).populate("messages");

  if (!conversation) {
    return res.status(200).json({ success: true, responseData: { messages: [], conversation: null } });
  }

  res.status(200).json({
    success: true,
    responseData: conversation,
  });
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new errorHandler("Message not found", 404));
  }

  // Sirf sender hi delete kar sakta hai
  if (message.senderId.toString() !== myId.toString()) {
    return next(
      new errorHandler("You can delete only your own messages", 403)
    );
  }

  // Conversation se message remove
  await Conversation.updateOne(
    {
      participants: {
        $all: [message.senderId, message.receiverId],
      },
    },
    {
      $pull: {
        messages: message._id,
      },
    }
  );

  // Message delete
  await Message.findByIdAndDelete(messageId);

  // Receiver ko realtime update
  const receiverSocketId = getSocketId(message.receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageDeleted", {
      messageId,
    });
  }

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
    responseData: {
      messageId,
    },
  });
});
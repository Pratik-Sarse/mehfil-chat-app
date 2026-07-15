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

  // Normalize message object for clients: convert ObjectIds to strings
  const messageToSend = newMessage.toObject ? newMessage.toObject() : JSON.parse(JSON.stringify(newMessage));
  if (messageToSend._id) messageToSend._id = messageToSend._id.toString();
  if (messageToSend.senderId) messageToSend.senderId = messageToSend.senderId.toString();
  if (messageToSend.receiverId) messageToSend.receiverId = messageToSend.receiverId.toString();
  if (messageToSend.deletedBy) messageToSend.deletedBy = messageToSend.deletedBy.toString();

  // Socket.IO
  const socketId = getSocketId(receiverId);

  if (socketId) {
    io.to(socketId).emit("newMessage", messageToSend);
  }

  res.status(200).json({
    success: true,
    responseData: messageToSend,
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

  // Ensure messages have string IDs for the client and mark deleted content for UI
  const conversationObj = conversation.toObject ? conversation.toObject() : JSON.parse(JSON.stringify(conversation));
  if (Array.isArray(conversationObj.messages)) {
    conversationObj.messages = conversationObj.messages.map((m) => {
      const mm = m.toObject ? m.toObject() : m;
      if (mm._id) mm._id = mm._id.toString();
      if (mm.senderId) mm.senderId = mm.senderId.toString();
      if (mm.receiverId) mm.receiverId = mm.receiverId.toString();
      if (mm.deletedBy) mm.deletedBy = mm.deletedBy.toString();
      if (mm.isDeleted) {
        mm.message = "This message was deleted";
      }
      return mm;
    });
  }

  res.status(200).json({
    success: true,
    responseData: conversationObj,
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

  message.isDeleted = true;
  message.deletedBy = myId;
  message.deletedAt = new Date();
  await message.save();

  const payload = {
    messageId: messageId.toString(),
    deletedBy: myId.toString(),
    deletedAt: message.deletedAt,
  };

  // Receiver ko realtime update
  const receiverSocketId = getSocketId(message.receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageDeleted", payload);
  }

  // Sender ko bhi realtime update
  const senderSocketId = getSocketId(myId);
  if (senderSocketId) {
    io.to(senderSocketId).emit("messageDeleted", payload);
  }

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
    responseData: payload,
  });
});
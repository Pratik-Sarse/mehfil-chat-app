import React, { useEffect } from "react";
import UserSidebar from "./UserSidebar";
import MessageContainer from "./MessageContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeSocket,
  setOnlineUsers,
  setTypingUser,
} from "../../store/slice/socket/socket.slice";
import { setMessageDeleted, setNewMessage } from "../../store/slice/message/message.slice";
import { incrementUnread } from "../../store/slice/user/user.slice";

const Home = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  const { socket } = useSelector((state) => state.socketReducer);

  useEffect(() => {
    if (!isAuthenticated || !userProfile?._id) return;

    dispatch(initializeSocket(userProfile._id));
  }, [isAuthenticated, userProfile, dispatch]);

  useEffect(() => {
    if (!socket) return;

    // Online Users
    const handleOnlineUsers = (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    };

    // New Message
    const handleNewMessage = (newMessage) => {
      const isCurrentChat =
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id);

      // Agar current chat open hai to message show karo
      if (isCurrentChat) {
        dispatch(setNewMessage(newMessage));
      }

      // Agar kisi aur user ka message aaya hai to unread badge badhao
      if (
        newMessage.senderId !== userProfile?._id &&
        newMessage.senderId !== selectedUser?._id
      ) {
        dispatch(incrementUnread(newMessage.senderId));
      }

      // Notification Sound
      if (newMessage.senderId !== userProfile?._id) {
        const audio = new Audio("/notification_whatsapp_style.wav");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    };

    // Message Deleted
    const handleMessageDeleted = ({ messageId, deletedBy, deletedAt }) => {
      dispatch(setMessageDeleted({ messageId, deletedBy, deletedAt }));
    };

    // Typing
    const handleTyping = ({ senderId }) => {
      if (selectedUser?._id === senderId) {
        dispatch(setTypingUser(senderId));
      }
    };

    // Stop Typing
    const handleStopTyping = ({ senderId }) => {
      if (selectedUser?._id === senderId) {
        dispatch(setTypingUser(null));
      }
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, dispatch, selectedUser, userProfile]);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-[100dvh] overflow-hidden">
        <UserSidebar />
        <MessageContainer />
      </div>

      {/* Mobile */}
      <div className="md:hidden h-[100dvh] overflow-hidden">
        {!selectedUser ? <UserSidebar /> : <MessageContainer />}
      </div>
    </>
  );
};

export default Home;
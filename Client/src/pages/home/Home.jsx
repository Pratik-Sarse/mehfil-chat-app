import React, { useEffect } from "react";
import UserSidebar from "./UserSidebar";
import MessageContainer from "./MessageContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeSocket,
  setOnlineUsers,
  setTypingUser,
} from "../../store/slice/socket/socket.slice";
import { setNewMessage } from "../../store/slice/message/message.slice";
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

    // Online users
    const handleOnlineUsers = (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    };

    // New message
const handleNewMessage = (newMessage) => {
  const isCurrentChat =
    selectedUser &&
    (newMessage.senderId === selectedUser._id ||
      newMessage.receiverId === selectedUser._id);

  // Current chat open hai
  if (isCurrentChat) {
    dispatch(setNewMessage(newMessage));
  }

  // Agar kisi aur user ka message aaya hai to unread count badhao
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
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("newMessage", handleNewMessage);
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
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../store/slice/user/user.slice";

const User = ({ userDetails }) => {
  const dispatch = useDispatch();

  const { selectedUser, unreadCounts } = useSelector(
    (state) => state.userReducer
  );

  const { onlineUsers, typingUser } = useSelector(
    (state) => state.socketReducer
  );

  const isUserOnline = onlineUsers?.includes(userDetails?._id);
  const unread = unreadCounts?.[userDetails?._id] || 0;

  const handleUserClick = () => {
    dispatch(setSelectedUser(userDetails));
  };

  return (
    <div
      onClick={handleUserClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
        userDetails?._id === selectedUser?._id
          ? "bg-gray-700"
          : "bg-slate-800"
      }`}
    >
      {/* Avatar */}
      <div className={`avatar ${isUserOnline ? "online" : ""}`}>
        <div className="w-12 rounded-full">
          <img
            className="bg-slate-700"
            src={userDetails?.avatar}
            alt={userDetails?.fullName}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h2
          className={`truncate ${
            unread > 0 ? "font-bold text-white" : "font-medium"
          }`}
        >
          {userDetails?.fullName}
        </h2>

        {typingUser === userDetails?._id ? (
          <p className="text-xs text-green-500 animate-pulse">
            Typing...
          </p>
        ) : (
          <p className="text-xs opacity-70 truncate">
            @{userDetails?.username}
          </p>
        )}
      </div>

      {/* Unread Badge */}
      {unread > 0 && (
  <div
    className="
      flex items-center justify-center
      min-w-[26px]
      h-[26px]
      px-2
      rounded-full
      bg-red-500
      text-white
      text-xs
      font-extrabold
      animate-bounce
      shadow-[0_0_18px_rgba(239,68,68,0.8)]
    "
  >
    {unread > 99 ? "99+" : unread}
  </div>
)}
    </div>
  );
};

export default User;
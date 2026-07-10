import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../store/slice/user/user.slice";

const User = ({ userDetails }) => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);

  const { onlineUsers, typingUser } = useSelector(
    (state) => state.socketReducer
  );

  const isUserOnline = onlineUsers?.includes(userDetails?._id);

  const handleUserClick = () => {
    dispatch(setSelectedUser(userDetails));
  };

  return (
    <div
      onClick={handleUserClick}
      className={`flex gap-5 items-center bg-slate-800 hover:bg-gray-700 rounded-lg py-1 px-2 cursor-pointer ${
        userDetails?._id === selectedUser?._id ? "bg-gray-700" : ""
      }`}
    >
      <div className={`avatar ${isUserOnline ? "online" : ""}`}>
        <div className="w-12 rounded-full">
          <img
            className="bg-slate-700"
            src={userDetails?.avatar}
            alt={userDetails?.fullName}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="line-clamp-1">{userDetails?.fullName}</h2>

        {typingUser === userDetails?._id ? (
          <p className="text-xs text-green-500 font-medium animate-pulse">
            Typing...
          </p>
        ) : (
          <p className="text-xs opacity-70 line-clamp-1">
            @{userDetails?.username}
          </p>
        )}
      </div>
    </div>
  );
};

export default User;
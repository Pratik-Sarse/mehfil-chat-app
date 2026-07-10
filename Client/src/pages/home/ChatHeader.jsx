import React from "react";
import { useSelector } from "react-redux";

const ChatHeader = ({ user }) => {
  const { typingUser } = useSelector((state) => state.socketReducer);

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="avatar flex-shrink-0">
        <div className="w-12 rounded-full">
          <img src={user?.avatar} alt={user?.username} />
        </div>
      </div>

      <div className="min-w-0">
        <h2 className="font-semibold truncate">
          {user?.fullName}
        </h2>

        {typingUser === user?._id ? (
          <p className="text-xs text-green-500 font-medium">
            Typing...
          </p>
        ) : (
          <p className="text-xs opacity-70 truncate">
            @{user?.username}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
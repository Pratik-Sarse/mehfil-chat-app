import React from "react";
import { useSelector } from "react-redux";
import { IoReloadOutline } from "react-icons/io5";

const ChatHeader = ({ user }) => {
  const { typingUser } = useSelector((state) => state.socketReducer);

  const handleRefresh = () => {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        window.location.reload();
      });
      return;
    }

    window.location.reload();
  };

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="avatar flex-shrink-0">
        <div className="w-12 rounded-full">
          <img src={user?.avatar} alt={user?.username} />
        </div>
      </div>

      <div className="min-w-0 flex-1">
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

      <button
        type="button"
        onClick={handleRefresh}
        className="btn btn-ghost btn-sm rounded-full p-2 text-info"
        aria-label="Reload app"
        title="Reload app"
      >
        <IoReloadOutline size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;
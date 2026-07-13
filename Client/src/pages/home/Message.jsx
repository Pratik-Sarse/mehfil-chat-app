import React, { useEffect, useRef, memo } from "react";
import { useSelector } from "react-redux";

const Message = ({ messageDetails }) => {
  const messageRef = useRef(null);

  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  const isMyMessage = userProfile?._id === messageDetails?.senderId;

  useEffect(() => {
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  return (
    <div
      ref={messageRef}
      className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            src={isMyMessage ? userProfile?.avatar : selectedUser?.avatar}
            alt="avatar"
          />
        </div>
      </div>

      <div className="chat-header mb-1">
        <time className="text-[10px] opacity-60">
          {new Date(messageDetails?.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </time>
      </div>

      <div className="chat-bubble break-words max-w-[75%] sm:max-w-md">
        {messageDetails?.message}
      </div>
    </div>
  );
};

export default memo(Message);
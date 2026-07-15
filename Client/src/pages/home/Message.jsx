import React, { useEffect, useRef, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessageThunk } from "../../store/slice/message/message.thunk";
import { IoTrashOutline } from "react-icons/io5";

const Message = ({ messageDetails }) => {
  const dispatch = useDispatch();
  const messageRef = useRef(null);
  const [showDelete, setShowDelete] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);

  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  const isMyMessage = userProfile?._id === messageDetails?.senderId;

  useEffect(() => {
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [pressTimer]);

  const handleDelete = () => {
    if (!isMyMessage || messageDetails?.isDeleted) return;
    dispatch(deleteMessageThunk({ messageId: messageDetails?._id }));
    setShowDelete(false);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (!isMyMessage || messageDetails?.isDeleted) return;
    setShowDelete(true);
  };

  const handlePointerDown = () => {
    if (!isMyMessage || messageDetails?.isDeleted) return;
    const timer = setTimeout(() => {
      setShowDelete(true);
    }, 450);
    setPressTimer(timer);
  };

  const handlePointerUpOrLeave = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

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

      <div
        className="chat-bubble break-words max-w-[75%] sm:max-w-md relative"
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
      >
        {messageDetails?.isDeleted ? (
          <span className="text-sm italic opacity-70">This message was deleted</span>
        ) : (
          messageDetails?.message
        )}

        {isMyMessage && !messageDetails?.isDeleted && showDelete && (
          <div className="absolute -top-3 -right-2 z-10 flex items-center rounded-full border border-base-300 bg-base-100 shadow-md px-2 py-1">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1 text-error text-xs font-medium"
              aria-label="Delete message"
            >
              <IoTrashOutline size={13} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Message);
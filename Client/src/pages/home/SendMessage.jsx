import React, { useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../store/slice/message/message.thunk";

const SendMessage = () => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { socket } = useSelector((state) => state.socketReducer);
  const { buttonLoading } = useSelector((state) => state.messageReducer);

  const [message, setMessage] = useState("");

  const typingTimeout = useRef(null);

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!socket || !selectedUser) return;

    socket.emit("typing", {
      receiverId: selectedUser._id,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selectedUser._id,
      });
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (buttonLoading) return;

    const text = message;

    setMessage("");

    dispatch(
      sendMessageThunk({
        recieverId: selectedUser._id,
        message: text,
      })
    );

    if (socket && selectedUser) {
      socket.emit("stopTyping", {
        receiverId: selectedUser._id,
      });
    }

    clearTimeout(typingTimeout.current);
  };

  return (
    <div className="w-full p-3 flex items-center gap-3 bg-base-100">
      <input
        type="text"
        placeholder="Type here..."
        className="input input-bordered input-primary flex-1"
        value={message}
        onChange={handleTyping}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />

      <button
        onClick={handleSendMessage}
        disabled={buttonLoading}
        className="btn btn-square btn-primary"
      >
        <IoIosSend size={25} />
      </button>
    </div>
  );
};

export default SendMessage;
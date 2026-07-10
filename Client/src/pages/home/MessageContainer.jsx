import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { getMessageThunk } from "../../store/slice/message/message.thunk";
import { setSelectedUser } from "../../store/slice/user/user.slice";
import SendMessage from "./SendMessage";
import { IoArrowBack } from "react-icons/io5";

const MessageContainer = () => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages } = useSelector((state) => state.messageReducer);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(
        getMessageThunk({
          recieverId: selectedUser._id,
        })
      );
    }
  }, [selectedUser, dispatch]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-5">
        <h2 className="text-2xl font-semibold">
          Welcome to Mehfil 👋
        </h2>

        <p className="text-lg text-center px-5">
          Please select a person to continue your chat!!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-base-100">

      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-base-100 flex-shrink-0">

        <ChatHeader user={selectedUser} />

        <button
          onClick={() => dispatch(setSelectedUser(null))}
          className="btn btn-square btn-sm btn-primary md:hidden ml-3"
        >
          <IoArrowBack size={22} />
        </button>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3">
        {messages?.map((messageDetails) => (
          <Message
            key={messageDetails._id}
            messageDetails={messageDetails}
          />
        ))}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/20 pt-2 bg-base-100">
        <SendMessage />
      </div>

    </div>
  );
};

export default MessageContainer;
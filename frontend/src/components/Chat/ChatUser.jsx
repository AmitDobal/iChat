import React from "react";

const ChatUser = ({
  id,
  username,
  profilePic,
  activeUser,
  profilePicSize = 8,
}) => {
  return (
    <button
      key={id}
      className={`flex flex-row items-center hover:bg-gray-100  rounded-xl p-2 ${
        activeUser === username && "bg-gray-100"
      } `}>
      <div
        className={`flex items-center justify-center h-${profilePicSize} w-${profilePicSize} bg-gray-200 rounded-full`}>
        <img
          src={profilePic}
          alt="Avatar"
          className="rounded-full w-8 h-8 object-cover"
        />
      </div>
      <div className="ml-2 text-sm font-semibold">{username}</div>
    </button>
  );
};

export default ChatUser;

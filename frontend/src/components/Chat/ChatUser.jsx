import React from "react";

const ChatUser = ({
  id,
  username,
  profilePic,
  activeUser,
  profilePicSize = 8,
  activeStatus,
  usersActiveMap,
}) => {
  return (
    <button
      key={id}
      //   onClick={() => handleClick(user)}
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
      {/* <span
        className={`${
          activeStatus === 1 || usersActiveMap[user.username] === true
            ? " bg-green-500 "
            : " bg-slate-400 "
        } h-3 w-3 rounded-full ml-2 `}
      /> */}
    </button>
  );
};

export default ChatUser;

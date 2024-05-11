import React from "react";
import moment from "moment";

const ChatCard = ({ text, picSrc, createdAt, isLeft, bgColor, username }) => {
  return (
    <div
      className={`${
        isLeft ? "col-start-1 col-end-8 " : "col-start-6 col-end-13 "
      }  p-3 rounded-lg`}>
      <div
        className={`flex items-center ${
          isLeft ? "flex-row " : "flex-row-reverse"
        }`}>
        <div
          className={`flex items-center rounded-full flex-shrink-0 flex-col`}>
          <img
            src={picSrc}
            alt="Avatar"
            className="rounded-full w-10 h-10 object-cover"
          />
          <div className="text-xs">{username}</div>
        </div>

        <div className="flex flex-col">
          <div
            className={`relative ${
              isLeft ? "ml-3 " : "mr-3 "
            } text-sm py-2 px-4 shadow rounded-xl ${bgColor}`}>
            <div>{text}</div>
          </div>
          <span
            className={`text-xs text-gray-400 ${
              isLeft ? "ml-6  mt-1  " : "mr-6 flex flex-row-reverse mt-1"
            }`}>
            {moment(createdAt)?.format("hh:mm A")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;

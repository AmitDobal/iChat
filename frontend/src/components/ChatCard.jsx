import React from "react";
import moment from "moment";

const ChatCard = ({ key, text, picSrc, createdAt, isLeft, bgColor }) => {
  return (
    <div
      key={key}
      className={`${
        isLeft ? "col-start-1 col-end-8 " : "col-start-6 col-end-13 "
      }  p-3 rounded-lg`}>
      <div
        className={`flex items-center ${
          isLeft ? "flex-row " : "flex-row-reverse"
        }`}>
        <div
          className={`flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 `}>
          <img
            src={picSrc}
            alt="Avatar"
            className="rounded-full w-10 h-10 object-cover"
          />
        </div>
        <div
          className={`relative ${
            isLeft ? "ml-3 " : "mr-3 "
          } text-sm py-2 px-4 shadow rounded-xl ${bgColor}`}>
          <div>{text}</div>
        </div>
      </div>
      <span
        className={`text-xs text-gray-400  ${
          isLeft ? "ml-14 " : "mr-14 flex flex-row-reverse "
        }`}>
        {moment(createdAt)?.format("hh:mm A")}
      </span>
    </div>
  );
};

export default ChatCard;

"use client";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import { useGroupsStore } from "@/zustand/useGroupsStore";
import { useNotificationsStore } from "@/zustand/useNotificationStore";
import axios from "axios";
import React, { useEffect } from "react";

const GroupUsers = ({ activeGroup, setActiveGroup }) => {
  const { groups, updateSelectedGroup } = useGroupsStore();
  const { chatReceiver, updateChatReceiver, updateChatReceiverPicURL } =
    useChatReceiverStore();
  const { updateChatMsgs, isChatMsgTabActive } = useChatMsgsStore();
  const { unreadMsgs, updateUnreadMsgs } = useNotificationsStore();

  useEffect(() => {
    if (chatReceiver && !isChatMsgTabActive) getMSgs();
  }, [chatReceiver, isChatMsgTabActive]);

  const getMSgs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}/msgs/group`,
        {
          params: {
            groupId: activeGroup,
          },
        },
        { withCredentials: true }
      );
      if (res.data) {
        const { _id, groupName, users, msgs } = res.data;
        const groupChatMsgs = msgs;
        const groupMetaData = { _id, groupName, users };

        if (groupChatMsgs?.length !== 0) {
          const grpMsgs = groupChatMsgs.map((msg) => ({
            ...msg,
            groupId: _id,
          }));
          updateChatMsgs(grpMsgs);
        } else {
          updateChatMsgs([]);
        }
        updateSelectedGroup(groupMetaData);
      }
    } catch (error) {
      console.error(
        "Error in geting the chat conversation messages: ",
        error.message
      );
    }
  };

  const handleClick = (group) => {
    updateChatReceiver(group._id);
    setActiveGroup(group._id);
    updateChatReceiverPicURL(group.groupPic);
    updateUnreadMsgs({ ...unreadMsgs, [group._id]: null });
  };

  return (
    <>
      {groups?.map((group) => (
        <button
          key={group._id}
          onClick={() => handleClick(group)}
          className={`flex flex-row items-center hover:bg-gray-100  rounded-xl p-2 ${
            activeGroup === group?._id && "bg-gray-100"
          } `}>
          <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
            <img
              src={group.groupPic}
              alt="Avatar"
              className="rounded-full w-8 h-8 object-cover"
            />
          </div>
          <div className="ml-2 text-sm font-semibold">{group.groupName}</div>
          {unreadMsgs &&
            unreadMsgs[group?._id] &&
            unreadMsgs[group?._id] > 0 && (
              <span
                className={`bg-red-500 h-4 w-4 rounded-full ml-2 text-white items-center text-xs font-bold flex justify-center `}>
                {unreadMsgs[group?._id]}
              </span>
            )}
        </button>
      ))}
    </>
  );
};

export default GroupUsers;

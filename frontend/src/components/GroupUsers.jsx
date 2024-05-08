"use client";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import { useGroupsStore } from "@/zustand/useGroupsStore";
import { useUsersStore } from "@/zustand/useUsersStore";
import axios from "axios";
import React, { useEffect, useState } from "react";

const GroupUsers = () => {
  const [displayUsers, setDisplayUsers] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);

  const { users } = useUsersStore();
  const { groups, updateSelectedGroup } = useGroupsStore();
  const { chatReceiver, updateChatReceiver, updateChatReceiverPicURL } =
    useChatReceiverStore();
  const { authName } = useAuthStore();
  const { updateChatMsgs, isChatMsgTabActive } = useChatMsgsStore();

  useEffect(() => {
    if (chatReceiver && !isChatMsgTabActive) getMSgs();
  }, [chatReceiver, isChatMsgTabActive]);

  useEffect(() => {
    let usersList = users.filter((user) => user.username != authName);
    setDisplayUsers(usersList);
  }, [users]);

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
          updateChatMsgs(groupChatMsgs);
        } else {
          updateChatMsgs([]);
        }
        updateSelectedGroup(groupMetaData);
        console.log("Group msgs:", res.data);
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
  };

  return (
    <>
      {/* {console.log("GROUPS DATA: ", groups)} */}
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
        </button>
      ))}
    </>
  );
};

export default GroupUsers;

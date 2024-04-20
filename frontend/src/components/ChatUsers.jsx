import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import useUsersStore from "@/zustand/useUsersStore";
import React, { useEffect, useState } from "react";

const ChatUsers = () => {
  const [displayUsers, setDisplayUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const { users } = useUsersStore();
  const { updateChatReceiver } = useChatReceiverStore();
  const { authName } = useAuthStore();

  useEffect(() => {
    const usersList = users.filter((user) => user.username != authName);
    setDisplayUsers(usersList);
  }, [users]);

  useEffect(() => {}, [authName]);

  const handleClick = (user) => {
    updateChatReceiver(user.username);
    setActiveUser(user.username);
  };

  return (
    <>
      {displayUsers?.map((user) => (
        <button
          key={user._id}
          onClick={() => handleClick(user)}
          className={`flex flex-row items-center hover:bg-gray-100  rounded-xl p-2 ${
            activeUser === user?.username && "bg-gray-100"
          } `}>
          <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2 text-sm font-semibold">{user.username}</div>
        </button>
      ))}
    </>
  );
};

export default ChatUsers;

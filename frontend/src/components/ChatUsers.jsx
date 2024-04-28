import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import { useUsersStore } from "@/zustand/useUsersStore";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ChatUsers = ({  }) => {
  const [displayUsers, setDisplayUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const { users,activeUsersMap } = useUsersStore();
  const { chatReceiver, updateChatReceiver, updateChatReceiverPicURL } =
    useChatReceiverStore();
  const { authName } = useAuthStore();
  const { updateChatMsgs } = useChatMsgsStore();

  useEffect(() => {
    if (chatReceiver) getMSgs();
  }, [chatReceiver]);

  useEffect(() => {
    let usersList = users.filter((user) => user.username != authName);
    // usersList.forEach((user) => {
    //   let actUser = activeUsers.find((usr) => usr.username === user.username);
    //   if (actUser) user.isActive = actUser.isActive;
    //   else user.isActive = false;
    // });
    // console.log("use DISPLAY USERS: ", activeUsers);
    console.log("CHAT USER ACTIVE MAAAP:",activeUsersMap)
    setDisplayUsers(usersList);
  }, [users, activeUsersMap]);

  const getMSgs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}/msgs`,
        {
          params: {
            sender: authName,
            receiver: chatReceiver,
          },
        },
        { withCredentials: true }
      );
      if (res.data?.length !== 0) {
        updateChatMsgs(res.data);
      } else {
        updateChatMsgs([]);
      }
    } catch (error) {
      console.error(
        "Error in geting the chat conversation messages: ",
        error.message
      );
    }
  };

  const handleClick = (user) => {
    updateChatReceiver(user.username);
    setActiveUser(user.username);
    updateChatReceiverPicURL(user.profilePic);
  };

  return (
    <>
      {console.log("AACTIVEEeeeeeeee USERRRRR RENDER:", activeUsersMap)}
      {/* {console.log(displayUsers)} */}
      {displayUsers?.map((user) => (
        <button
          key={user._id}
          onClick={() => handleClick(user)}
          className={`flex flex-row items-center hover:bg-gray-100  rounded-xl p-2 ${
            activeUser === user?.username && "bg-gray-100"
          } `}>
          <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
            <img
              src={user.profilePic}
              alt="Avatar"
              className="rounded-full w-8 h-8 object-cover"
            />
          </div>
          <div className="ml-2 text-sm font-semibold">{user.username}</div>
          <span
            className={`${
              activeUsersMap && activeUsersMap[user.username] ? " bg-green-500 " : " bg-slate-400 "
            } h-3 w-3 rounded-full ml-2 `}
          />
        </button>
      ))}
    </>
  );
};

export default ChatUsers;

"use client";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import { useUsersStore } from "@/zustand/useUsersStore";
import { Spin, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import AvatarCard from "@/components/AvatarCard";
import Picker from "@emoji-mart/react";
import ChatCards from "@/components/ChatCards";
import { IoChatbubblesSharp } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import Upload from "antd/es/upload/Upload";
import { useRouter } from "next/navigation";

import ConversationTabs from "@/components/ConversationTabs";
import { useGroupsStore } from "@/zustand/useGroupsStore";
import GroupChatCards from "@/components/GroupChatCards";
import { useNotificationsStore } from "@/zustand/useNotificationStore";

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const [recievedMsg, setRecievedMsg] = useState({});
  const [usersActive, setUsersActive] = useState({});
  const [usersActiveMap, setUsersActiveMap] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);

  const { authName, authPicURL } = useAuthStore();
  const { updateUsers } = useUsersStore();
  const chatReceiver = useChatReceiverStore((state) => state.chatReceiver);
  const chatReceiverPicURL = useChatReceiverStore(
    (state) => state.chatReceiverPicURL
  );
  const { chatMsgs, updateChatMsgs, isChatMsgTabActive } = useChatMsgsStore();
  const { updateGroups, selectedGroup } = useGroupsStore();
  const { unreadMsgs, updateUnreadMsgs } = useNotificationsStore();

  const router = useRouter();
  const endOfMEssagesRef = useRef(null);
  useEffect(() => {
    authentication();
    if (authName) {
      const newSocket = io(process.env.NEXT_PUBLIC_CHAT_SERVER_URL, {
        query: {
          username: authName,
        },
      });
      setSocket(newSocket);
      newSocket.on("active", (actUser) => {
        setUsersActive(actUser);
      });
      newSocket.on("chat msg", (msgRecieve) => {
        setRecievedMsg(msgRecieve);
      });
      newSocket.on("group msg", (msgRecieve) => {
        console.log("Group msg received: ", msgRecieve);
        setRecievedMsg(msgRecieve);
      });
      getUsersData();
      getGroupsData();
      return () => newSocket.close();
    }
  }, [authName]);

  useEffect(() => {
    updateChatMsgs([...chatMsgs, recievedMsg]);
    handleUnreadMsgs();
  }, [recievedMsg]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMsgs]);

  useEffect(() => {
    setUsersActiveMap((prev) => ({
      ...prev,
      [usersActive.username]: usersActive.activeStatus,
    }));
  }, [usersActive]);

  const authentication = async () => {
    let isAuthPassed = true;
    const localAuthName = localStorage.getItem("auth-storage");
    const auth = JSON.parse(localAuthName)?.state?.authName;
    if (!auth) {
      router.replace("/");
      message.error(`Please Login`);
      isAuthPassed = false;
    }

    try {
      const verifyRes = await axios.get(
        process.env.NEXT_PUBLIC_AUTH_VERIFY_API,
        { withCredentials: true }
      );
      if (verifyRes.status !== 200) isAuthPassed = false;
    } catch (error) {
      console.error("ERROR while verifying token:", error.message);
      isAuthPassed = false;
    }
    if (!isAuthPassed) router.replace("/");
    if (isAuthPassed) setIsLoading(false);
    return isAuthPassed;
  };

  const getUsersData = async () => {
    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_USERS_API, {
        withCredentials: true,
      });
      updateUsers(res.data);
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
      console.log(
        "Error while fetching users data from backend:",
        error.message
      );
    }
  };

  const getGroupsData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}/msgs/groups`,
        {
          params: {
            username: authName,
          },
        },
        {
          withCredentials: true,
        }
      );
      updateGroups(res.data);
    } catch (error) {
      console.log(
        "Error while fetching Grups data from backend:",
        error.message
      );
    }
  };

  const sendMsg = () => {
    if (msg) {
      //send msg to one to one Chat
      if (isChatMsgTabActive) {
        const msgToBeSent = {
          text: msg,
          sender: authName,
          receiver: chatReceiver,
        };
        if (socket) {
          socket.emit("chat msg", msgToBeSent);
        }
        updateChatMsgs([...chatMsgs, msgToBeSent]);
      } else {
        //Send msg to Group chat
        const msgToBeSent = {
          groupId: chatReceiver,
          text: msg,
          sender: authName,
        };
        if (socket) {
          socket.emit("group msg", msgToBeSent);
        }
        updateChatMsgs([...chatMsgs, msgToBeSent]);
      }
    }
    setMsg("");
    closeEmojis();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMsg();
      closeEmojis();
    }
  };

  const scrollToBottom = () => {
    endOfMEssagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addEmoji = (e) => {
    setMsg((prev) => prev + e.native);
  };

  const closeEmojis = () => {
    setShowEmojis(false);
  };

  const handleUnreadMsgs = () => {
    let sender = recievedMsg.sender;
    //If It is a group msg
    if (recievedMsg.groupId) {
      sender = recievedMsg.groupId;
    }
    let senderMsgCount = unreadMsgs[sender];
    if (sender && sender !== chatReceiver) {
      if (senderMsgCount) {
        senderMsgCount++;
        updateUnreadMsgs({ ...unreadMsgs, [sender]: senderMsgCount });
      } else {
        updateUnreadMsgs({ ...unreadMsgs, [sender]: 1 });
      }
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="h-screen flex justify-center items-center ">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex h-screen antialiased text-gray-800">
          <div className="flex flex-row h-full w-full overflow-x-auto">
            <div className="flex flex-col pt-2 pb-10 pl-6 pr-2 w-64 bg-white flex-shrink-0">
              <div className="flex flex-row items-center justify- h-12 w-full">
                <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                  <IoChatbubblesSharp className="w-10 h-6" />
                </div>
                <div className="ml-2 font-bold text-2xl">iChat</div>
              </div>
              <AvatarCard authName={authName} />
              <ConversationTabs usersActiveMap={usersActiveMap} />
            </div>

            <div className="flex flex-col flex-auto h-full p-6 top-2 ">
              <div className="flex flex-col leading-tight mb-2">
                <div className="text-xl mt-1 flex items-center gap-2">
                  {chatReceiver && (
                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                      <img
                        src={chatReceiverPicURL}
                        alt="Avatar"
                        className="rounded-full w-8 h-8 object-cover "
                      />
                    </div>
                  )}
                  <span className="text-gray-700 mr-3">
                    {isChatMsgTabActive
                      ? chatReceiver
                      : selectedGroup?.groupName}
                  </span>
                </div>
              </div>
              {/* Chat section */}
              <div
                className={`${
                  (!chatReceiver || !authName) && "hidden "
                } flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-[95%] p-4 `}>
                <div
                  onClick={closeEmojis}
                  className="flex flex-col h-full overflow-x-auto mb-4">
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-12 gap-y-2 ">
                      {isChatMsgTabActive ? (
                        <ChatCards
                          chatMsgs={chatMsgs}
                          authName={authName}
                          chatReceiver={chatReceiver}
                          chatReceiverPicURL={chatReceiverPicURL}
                          authPicURL={authPicURL}
                          endOfMEssagesRef={endOfMEssagesRef}
                        />
                      ) : (
                        <GroupChatCards
                          chatMsgs={chatMsgs}
                          authName={authName}
                          chatReceiver={chatReceiver}
                          chatReceiverPicURL={chatReceiverPicURL}
                          authPicURL={authPicURL}
                          endOfMEssagesRef={endOfMEssagesRef}
                        />
                      )}

                      <div ref={endOfMEssagesRef} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 mb-2">
                  <div>
                    <button>
                      <Upload className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                        <ImAttachment />
                      </Upload>
                    </button>
                  </div>
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        onKeyDown={handleInputKeyDown}
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onClick={closeEmojis}
                        type="text"
                        disabled={!chatReceiver}
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />
                      <button
                        onClick={() => setShowEmojis((prev) => !prev)}
                        className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                        <MdOutlineEmojiEmotions className="w-6 h-6" />
                      </button>
                      {showEmojis && (
                        <div className="absolute bottom-12 right-0 z-10">
                          <Picker onEmojiSelect={addEmoji} theme="light" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={sendMsg}
                      disabled={!chatReceiver}
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                      <span>Send</span>
                      <span className="ml-2">
                        <LuSend />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage;

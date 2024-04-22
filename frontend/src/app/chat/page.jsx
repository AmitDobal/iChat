"use client";
import ChatUsers from "@/components/ChatUsers";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import useUsersStore from "@/zustand/useUsersStore";
import { Spin } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import AvatarCard from "@/components/AvatarCard";

// export const metadata = {
//   title: "iChat-Home",
//   description: "Home page to chat with your friends and family",
// };

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { authName, authPicURL } = useAuthStore();
  const { users, updateUsers } = useUsersStore();
  const chatReceiver = useChatReceiverStore((state) => state.chatReceiver);
  const chatReceiverPicURL = useChatReceiverStore(
    (state) => state.chatReceiverPicURL
  );
  const { chatMsgs, updateChatMsgs } = useChatMsgsStore();

  const endOfMEssagesRef = useRef(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_CHAT_SERVER_URL, {
      query: {
        username: authName,
      },
    });
    setSocket(newSocket);

    newSocket.on("chat msg", (msgRecieve) => {
      console.log("Recieve msg on client " + JSON.stringify(msgRecieve));
      updateChatMsgs([...chatMsgs, msgRecieve]);
      // setMsgs((prevMsgs) => [
      //   ...prevMsgs,
      //   { text: msgRecieve.text, sentByCurrentUser: false },
      // ]);
    });

    getUerData();

    return () => newSocket.close();
  }, [chatMsgs]);

  const getUerData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(process.env.NEXT_PUBLIC_USERS_API, {
        withCredentials: true,
      });
      updateUsers(res.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(
        "Error while fetching users data from backend:",
        error.message
      );
    }
  };

  const sendMsg = () => {
    const msgToBeSent = {
      text: msg,
      sender: authName,
      receiver: chatReceiver,
    };
    if (socket) {
      socket.emit("chat msg", msgToBeSent);
      updateChatMsgs([...chatMsgs, msgToBeSent]);
      // setMsgs((prevMsg) => [
      //   ...prevMsg,
      //   { text: msg, sentByCurrentUser: true },
      // ]);
      setMsg("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMsgs]);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") sendMsg();
  };

  const scrollToBottom = () => {
    endOfMEssagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-auto">
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <div className="ml-2 font-bold text-2xl">iChat</div>
            </div>
            <AvatarCard authName={authName} />
            <div className="flex flex-col mt-8">
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Active Conversations</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  {users?.length - 1}
                </span>
              </div>
              <Spin spinning={isLoading}>
                <div className="flex flex-col space-y-1 mt-4 -mx-2 h-52 overflow-y-auto">
                  <ChatUsers />

                  {/* 
                <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                  <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                    M
                  </div>
                  <div className="ml-2 text-sm font-semibold">Marta Curtis</div>
                  <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
                    2
                  </div>
                </button>
                 */}
                </div>
              </Spin>
              {/* <div className="flex flex-row items-center justify-between text-xs mt-6">
                <span className="font-bold">Archivied</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  7
                </span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2">
                <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                  <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                    H
                  </div>
                  <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
                </button>
              </div> */}
            </div>
          </div>

          <div className="flex flex-col flex-auto h-full p-6 top-2 ">
            <div class="flex flex-col leading-tight mb-2">
              <div class="text-xl mt-1 flex items-center gap-2">
                {chatReceiver && (
                  <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                    <img
                      src={chatReceiverPicURL}
                      alt="Avatar"
                      className="rounded-full w-8 h-8 object-cover "
                    />
                  </div>
                )}
                <span class="text-gray-700 mr-3">{chatReceiver}</span>
              </div>
            </div>
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {chatMsgs.map((currentMsg, i) => (
                      <>
                        {currentMsg?.sender !== authName ? (
                          <>
                            {currentMsg?.sender === chatReceiver && (
                              <div
                                key={i}
                                className="col-start-1 col-end-8 p-3 rounded-lg">
                                <div className="flex flex-row items-center">
                                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    {/* {chatReceiver?.charAt(0).toUpperCase()} */}
                                    <img
                                      src={chatReceiverPicURL}
                                      alt="Avatar"
                                      className="rounded-full w-10 h-10 object-cover"
                                    />
                                  </div>
                                  <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div>{currentMsg.text}</div>
                                  </div>
                                </div>
                                <span class="text-xs text-gray-400 ml-14">
                                  {moment(currentMsg?.createdAt)?.format(
                                    "hh:mm A"
                                  )}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="col-start-6 col-end-13 p-3 rounded-lg">
                            <div className="flex items-center justify-start flex-row-reverse">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-300 flex-shrink-0">
                                <img
                                  src={authPicURL}
                                  alt="Avatar"
                                  className="rounded-full w-10 h-10 object-cover"
                                />
                              </div>
                              <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                <div>{currentMsg.text}</div>
                              </div>
                            </div>
                            <span class="text-xs text-gray-400 flex items-center justify-start flex-row-reverse mr-14">
                              {moment(currentMsg?.createdAt)?.format("hh:mm A")}
                            </span>
                          </div>
                        )}
                      </>
                    ))}
                    <div ref={endOfMEssagesRef} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 mb-2">
                <div>
                  <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      onKeyDown={handleInputKeyDown}
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      type="text"
                      disabled={!chatReceiver}
                      className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    />
                    <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={sendMsg}
                    disabled={!chatReceiver}
                    className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                    <span>Send</span>
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

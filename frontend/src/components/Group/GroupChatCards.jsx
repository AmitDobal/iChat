import React, { useState } from "react";

import ChatCard from "../Chat/ChatCard";
import { useGroupsStore } from "@/zustand/useGroupsStore";

const GroupChatCards = ({
  chatMsgs,
  authName,
  chatReceiver,
  chatReceiverPicURL,
  authPicURL,
}) => {
  const { selectedGroup } = useGroupsStore();

  const showSenderCard = (currentMsg) => {
    const sender = selectedGroup?.users?.find(
      (user) => user?.username === currentMsg?.sender
    );
    return (
      <ChatCard
        text={currentMsg?.text}
        picSrc={sender?.profilePic}
        createdAt={currentMsg?.createdAt}
        isLeft={true}
        bgColor="bg-white"
        username={sender.username}
      />
    );
  };
  return (
    <>
      {chatMsgs?.map((currentMsg, i) => (
        <React.Fragment key={i}>
          {currentMsg?.sender !== authName ? (
            <>
              {selectedGroup?._id === chatReceiver &&
                currentMsg?.groupId === selectedGroup?._id &&
                showSenderCard(currentMsg, chatReceiverPicURL)}
            </>
          ) : (
            <ChatCard
              text={currentMsg?.text}
              picSrc={authPicURL}
              createdAt={currentMsg?.createdAt}
              isLeft={false}
              bgColor="bg-indigo-100"
              username={"You"}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};
export default GroupChatCards;

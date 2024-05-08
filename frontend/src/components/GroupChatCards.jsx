import React, { useState } from "react";

import ChatCard from "./ChatCard";
import { useGroupsStore } from "@/zustand/useGroupsStore";

const GroupChatCards = ({
  chatMsgs,
  authName,
  chatReceiver,
  chatReceiverPicURL,
  authPicURL,
}) => {
  const [senderPic, setSenderPic] = useState("");
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
                showSenderCard(currentMsg, chatReceiverPicURL)}
            </>
          ) : (
            <ChatCard
              text={currentMsg?.text}
              picSrc={authPicURL}
              createdAt={currentMsg?.createdAt}
              isLeft={false}
              bgColor="bg-indigo-100"
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};
export default GroupChatCards;

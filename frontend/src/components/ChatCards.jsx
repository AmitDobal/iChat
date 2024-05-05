import React from "react";
import ChatCard from "./ChatCard";

const ChatCards = ({
  chatMsgs,
  authName,
  chatReceiver,
  chatReceiverPicURL,
  authPicURL,
}) => {
  return (
    <>
      {chatMsgs.map((currentMsg, i) => (
        <React.Fragment key={i}>
          {currentMsg?.sender !== authName ? (
            <>
              {currentMsg?.sender === chatReceiver && (
                <ChatCard
                  text={currentMsg.text}
                  picSrc={chatReceiverPicURL}
                  createdAt={currentMsg.createdAt}
                  isLeft={true}
                  bgColor="bg-white"
                />
              )}
            </>
          ) : (
            <ChatCard
              text={currentMsg.text}
              picSrc={authPicURL}
              createdAt={currentMsg.createdAt}
              isLeft={false}
              bgColor="bg-indigo-100"
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ChatCards;

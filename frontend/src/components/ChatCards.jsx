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
        <>
          {currentMsg?.sender !== authName ? (
            <>
              {currentMsg?.sender === chatReceiver && (
                <ChatCard
                  key={i}
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
              key={i}
              text={currentMsg.text}
              picSrc={authPicURL}
              createdAt={currentMsg.createdAt}
              isLeft={false}
              bgColor="bg-indigo-100"
            />
          )}
        </>
      ))}
    </>
    // <>
    //   {chatMsgs.map((currentMsg, i) => (
    //     <>
    //       {currentMsg?.sender !== authName ? (
    //         <>
    //           {currentMsg?.sender === chatReceiver && (
    //             <div key={i} className="col-start-1 col-end-8 p-3 rounded-lg">
    //               <div className="flex flex-row items-center">
    //                 <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
    //                   <img
    //                     src={chatReceiverPicURL}
    //                     alt="Avatar"
    //                     className="rounded-full w-10 h-10 object-cover"
    //                   />
    //                 </div>
    //                 <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
    //                   <div>{currentMsg.text}</div>
    //                 </div>
    //               </div>
    //               <span class="text-xs text-gray-400 ml-14">
    //                 {moment(currentMsg?.createdAt)?.format("hh:mm A")}
    //               </span>
    //             </div>
    //           )}
    //         </>
    //       ) : (
    //         <div className="col-start-6 col-end-13 p-3 rounded-lg">
    //           <div className="flex items-center flex-row-reverse">
    //             <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-300 flex-shrink-0">
    //               <img
    //                 src={authPicURL}
    //                 alt="Avatar"
    //                 className="rounded-full w-10 h-10 object-cover"
    //               />
    //             </div>
    //             <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
    //               <div>{currentMsg.text}</div>
    //             </div>
    //           </div>
    //           <span class="text-xs text-gray-400  mr-14 flex flex-row-reverse">
    //             {moment(currentMsg?.createdAt)?.format("hh:mm A")}
    //           </span>
    //         </div>
    //       )}
    //     </>
    //   ))}
    // </>
  );
};

export default ChatCards;

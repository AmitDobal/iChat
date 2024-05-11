import React, { useState } from "react";
import GroupDetailsModal from "../Group/GroupDetailsModal";

const ChatSectionHeader = ({
  chatReceiver,
  chatReceiverPicURL,
  isChatMsgTabActive,
  selectedGroup,
}) => {
  const [openGroupDetailsModal, setOpenGroupDetailsModal] = useState(false);
  const handleIconClick = () => {
    console.log(
      "CLEICK",
      chatReceiver,
      chatReceiverPicURL,
      isChatMsgTabActive,
      selectedGroup
    );
    if(!isChatMsgTabActive) setOpenGroupDetailsModal(true);
  };
  return (
    <>
      {chatReceiver && (
        <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
          <img
            src={chatReceiverPicURL}
            alt="Avatar"
            onClick={handleIconClick}
            className="rounded-full w-8 h-8 object-cover cursor-pointer"
          />
        </div>
      )}
      <span className="text-gray-700 mr-3">
        {isChatMsgTabActive ? chatReceiver : selectedGroup?.groupName}
      </span>
      <GroupDetailsModal
        open={openGroupDetailsModal}
        setOpen={setOpenGroupDetailsModal}
      />
    </>
  );
};

export default ChatSectionHeader;

import { Modal, Tag } from "antd";
import React from "react";
import ChatUser from "../Chat/ChatUser";
import { CloseCircleOutlined } from "@ant-design/icons";

const GroupDetailsModal = ({ open, setOpen, groupPic, groupData }) => {
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {
    console.log("OK clicked");
  };
  const ModalTitle = (
    <div>
      <div className="flex gap-2 items-center ">
        <img
          src={groupPic}
          alt="Avatar"
          className="rounded-full w-8 h-8 object-cover cursor-pointer"
        />
        <div>
          <div>{groupData?.groupName}</div>
          <p className="text-xs  text-gray-400 ">
            {groupData?.users?.length} members
          </p>
        </div>
      </div>
    </div>
  );
  const handleChipClose = () => {};
  return (
    <Modal
      title={ModalTitle}
      open={open}
      onCancel={handleCancel}
      okText="Save"
      onOk={handleOk}>
      <div className="flex flex-col gap-1">
        <div className="text-sm text-blue-950 font-semibold">Members:</div>
        <div className="h-40">
          <div className="w-full overflow-y-auto bg-slate-100 h-full rounded-lg p-2">
            {groupData?.users?.map((user) => (
              <Tag key={user._id} color="cyan">
                <div className="flex gap-2">
                  <ChatUser
                    username={user.username}
                    profilePic={user.profilePic}
                    profilePicSize={2}
                  />
                  <div
                    onClick={() => handleChipClose(user)}
                    className="text-red-500 cursor-pointer ">
                    <CloseCircleOutlined />
                  </div>
                </div>
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GroupDetailsModal;

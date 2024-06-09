import { Button, Modal, Tag } from "antd";
import React, { useEffect, useState } from "react";
import ChatUser from "../Chat/ChatUser";
import { CloseCircleOutlined } from "@ant-design/icons";
import SearchChatUser from "../Search/SearchChatUser";
import { useGroupsStore } from "@/zustand/useGroupsStore";

const GroupDetailsModal = ({ open, setOpen, groupPic, groupData }) => {
  const [usersAdded, setUsersAdded] = useState([]);
  const [showSearchUser, setShowSearchUser] = useState(false);
  // const {groups, removeUserFromGroup} = useGroupsStore();

  useEffect(() => {
    setUsersAdded(groupData.users)
  }, [groupData])
  

  const handleCancel = () => {
    setOpen(false);
    setShowSearchUser(false);
  };
  const handleOk = () => {
    // console.log("OK clicked", groups);
    setShowSearchUser(false);
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
  const handleChipClose = (user) => {
    console.log("CLOSE", user);
    // console.log(groupData)
    // removeUserFromGroup(groupData?._id, user?._id)
    // groupData?.users?.filter()
  };
  const handleAddMember = () => {
    console.log("ADD");
    setShowSearchUser(true);
  };
  return (
    <Modal
      title={ModalTitle}
      open={open}
      onCancel={handleCancel}
      okText="Save"
      onOk={handleOk}>
      <div className="flex flex-col gap-1">
        <div className="flex  justify-between items-end">
          <div className="text-sm text-blue-950 font-semibold">Members:</div>
          <div className="flex gap-2 items-center">
            <div className={`${!showSearchUser && "hidden "}   w-52`}>
              <SearchChatUser
                width="100%"
                usersAdded={usersAdded}
                setUsersAdded={setUsersAdded}
              />
            </div>
            <div className={`${showSearchUser && 'hidden'}`} >
              <Button
                onClick={handleAddMember}
                className="bg-green-700 text-white hover:bg-green-400">
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="h-40">
          <div className="w-full overflow-y-auto bg-slate-100 h-full rounded-lg p-2">
            {groupData?.users?.map((user) => (
              <Tag
                key={user._id}
                className="bg-gradient-to-b from-gray-50 to-gray-100 shadow-lg">
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

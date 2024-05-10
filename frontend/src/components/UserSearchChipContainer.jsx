import React from "react";
import SearchChatUser from "./SearchChatUser";
import { Tag } from "antd";
import ChatUser from "./ChatUser";
import { CloseCircleOutlined } from "@ant-design/icons";

const UserSearchChipContainer = ({usersAdded, setUsersAdded}) => {
  const handleChipClose = (user) => {
    const filteredUsers = usersAdded.filter((item) => item._id !== user._id);
    setUsersAdded(filteredUsers);
  };

  return (
    <>
      <div className=" w-full">
        <SearchChatUser width="100%" usersAdded={usersAdded} setUsersAdded={setUsersAdded} />
      </div>
      <div className="w-full overflow-y-auto bg-slate-100 h-full rounded-lg" >
        {usersAdded?.map((user) => (
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
    </>
  );
};

export default UserSearchChipContainer;

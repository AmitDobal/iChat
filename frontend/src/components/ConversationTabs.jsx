import React, { useState } from "react";
import { UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import ChatUsers from "./ChatUsers";
import GroupTabContainer from "./GroupTabContainer";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";
import { useChatReceiverStore } from "@/zustand/useChatReceiverStore";
import { useGroupsStore } from "@/zustand/useGroupsStore";

const ConversationTabs = ({ usersActiveMap }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  const { updateIsChatMsgTabActive } = useChatMsgsStore();
  const { updateChatReceiver } = useChatReceiverStore();
  const { updateSelectedGroup } = useGroupsStore();

  const handleActiveTab = (key) => {
    if (key === "chats") {
      updateIsChatMsgTabActive(true);
    } else {
      updateIsChatMsgTabActive(false);
    }
    updateChatReceiver("");
    updateSelectedGroup({});
    setActiveUser(null);
    setActiveGroup(null);
  };
  const tabItems = [
    {
      key: "chats",
      label: "Chats",
      children: (
        <div className="flex flex-col space-y-1 -mx-2 h-52 overflow-y-auto ">
          <ChatUsers
            usersActiveMap={usersActiveMap}
            activeUser={activeUser}
            setActiveUser={setActiveUser}
          />
        </div>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "groups",
      label: "Groups",
      children: (
        <GroupTabContainer
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
        />
      ),
      icon: <UsergroupAddOutlined />,
    },
  ];
  return (
    <Tabs defaultActiveKey="2" items={tabItems} onChange={handleActiveTab} />
  );
};

export default ConversationTabs;

import React from "react";
import { UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import ChatUsers from "./ChatUsers";
import GroupTabContainer from "./GroupTabContainer";
import { useChatMsgsStore } from "@/zustand/useChatMsgsStore";

const ConversationTabs = ({ usersActiveMap }) => {
  const { updateIsChatMsgTabActive } = useChatMsgsStore();

  const handleActiveTab = (key) => {
    if (key === "chats") {
      updateIsChatMsgTabActive(true);
    } else {
      updateIsChatMsgTabActive(false);
    }
  };
  const tabItems = [
    {
      key: "chats",
      label: "Chats",
      children: (
        <div className="flex flex-col space-y-1  -mx-2 h-52 overflow-y-auto">
          <ChatUsers usersActiveMap={usersActiveMap} />
        </div>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "groups",
      label: "Groups",
      children: <GroupTabContainer usersActiveMap={usersActiveMap} />,
      icon: <UsergroupAddOutlined />,
    },
  ];
  return (
    <Tabs defaultActiveKey="2" items={tabItems} onChange={handleActiveTab} />
  );
};

export default ConversationTabs;

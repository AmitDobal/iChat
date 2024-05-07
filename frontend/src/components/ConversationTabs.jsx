import React from "react";
import { UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import ChatUsers from "./ChatUsers";
import GroupTabContainer from "./GroupTabContainer";

const ConversationTabs = ({ usersActiveMap }) => {
  const tabItems = [
    {
      key: 1,
      label: "Chats",
      children: (
        <div className="flex flex-col space-y-1  -mx-2 h-52 overflow-y-auto">
          <ChatUsers usersActiveMap={usersActiveMap} />
        </div>
      ),
      icon: <UserOutlined />,
    },
    {
      key: 2,
      label: "Groups",
      children: <GroupTabContainer usersActiveMap={usersActiveMap} />,
      icon: <UsergroupAddOutlined />,
    },
  ];
  return <Tabs defaultActiveKey="2" items={tabItems} />;
};

export default ConversationTabs;

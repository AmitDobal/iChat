import React from "react";
import GroupModal from "./GroupModal";
import GroupUsers from "./GroupUsers";

const GroupTabContainer = ({ usersActiveMap }) => {
  return (
    <div className="relative ">
      <div className="absolute flex ml-32 ">
        <GroupModal />
      </div>
      <div className="flex flex-col space-y-1  -mx-2 h-44 overflow-y-auto ">
        <GroupUsers />
      </div>
    </div>
  );
};

export default GroupTabContainer;

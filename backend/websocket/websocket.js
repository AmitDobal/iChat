import {
  addMsgToConversation,
  addMsgToGroupConversation,
  getGroupUsersUsername,
} from "../controllers/msgs.controller.js";
import { publish, subscribe } from "../redis/msgsPubSub.js";

export const subscribedToUsername = (username, socket) => {
  const channelName = `chat_${username}`;
  subscribe(channelName, (msg) => {
    try {
      socket.emit("chat msg", JSON.parse(msg));
    } catch (error) {
      console.log(
        "Error during subscribe callback: " + channelName,
        error.message
      );
    }
  });
};

//Chat msg event callback
export const chatMsgEvent = (userSocketMap) => {
  return (msg) => {
    const receiverSocket = userSocketMap[msg?.receiver];
    addMsgToConversation([msg.sender, msg.receiver], {
      text: msg.text,
      sender: msg.sender,
      receiver: msg.receiver,
    });
    if (receiverSocket) {
      receiverSocket.emit("chat msg", msg);
    } else {
      const channelName = `chat_${msg.receiver}`;
      publish(channelName, JSON.stringify(msg));
    }
  };
};

//Group msg event callback
export const groupMsgEvent = (userSocketMap) => {
  return async (msg) => {
    const membersUsername = await getMembersUsername(msg);
    addMsgToGroupConversation(msg.groupId, msg);

    membersUsername.forEach((member) => {
      const memberSocket = userSocketMap[member];
      if (memberSocket) {
        memberSocket.emit("group msg", msg);
      }
    });
  };
};

const getMembersUsername = async (msg) => {
  const groupData = await getGroupUsersUsername(msg.groupId);
  const members = groupData?.users;
  const membersUsername = members
    ?.map((member) => member.username)
    ?.filter((member) => member !== msg?.sender);
  return membersUsername;
};

//Notification Event
export const notificationEvent = (userSocketMap) => {
    return (msg) => {
        
    }
}

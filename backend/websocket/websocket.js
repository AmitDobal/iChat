import {
  addMsgToConversation,
  addMsgToGroupConversation,
  getGroupUsersUsername,
} from "../controllers/msgs.controller.js";
import { getAllUserUsername } from "../controllers/users.controller.js";
import { publish, subscribe } from "../redis/msgsPubSub.js";

export const subscribedToUsername = (username, socket) => {
  const channelName = `chat_${username}`;
  subscribe(channelName, (msg) => {
    try {
      const recieved = JSON.parse(msg);
      if (recieved?.chatMsg) socket.emit("chat msg", recieved.chatMsg);
      if (recieved?.active) socket.emit("active", recieved.active);
    } catch (error) {
      console.log(
        "Error during subscribe callback: " + channelName,
        error.message
      );
    }
  });
};

//Active (Online / Offline) event
export const activeStatusEvent = async (
  currentUsername,
  userSocketMap,
  isActive
) => {
  try {
    const allUsers = await getAllUserUsername(currentUsername);
    const usernames = allUsers?.map((user) => user?.username);
    console.log(usernames);

    usernames?.forEach((username) => {
      const userSocket = userSocketMap[username];
      const active = {
        username: currentUsername,
        activeStatus: isActive,
      };
      if (userSocket) {
        userSocket.emit("active", active);
      } else {
        const jsonToPublish = { active: active };
        const channelName = `chat_${username}`;
        publish(channelName, JSON.stringify(jsonToPublish));
      }
    });
  } catch (error) {
    console.log("error in activeness: ", error.message);
  }
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

      const jsonToPublish = { chatMsg: msg };
      publish(channelName, JSON.stringify(jsonToPublish));
    }
  };
};

//Group msg event callback
export const groupMsgEvent = (userSocketMap) => {
  return async (msg) => {
    const membersUsername = await getMembersUsername(msg);
    addMsgToGroupConversation(msg.groupId, msg);

    membersUsername?.forEach((member) => {
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
  return (msg) => {};
};

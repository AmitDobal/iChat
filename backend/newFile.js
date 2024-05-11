import {
  addMsgToConversation,
  addMsgToGroupConversation,
  getGroupUsersUsername
} from "./controllers/msgs.controller.js";
import { publish, subscribe } from "./redis/msgsPubSub.js";
import { updateUserActiveStatus } from "./controllers/users.controller.js";
import { io, userSocketMap } from "./index.js";

io.on("connection", (socket) => {
  const username = socket.handshake.query.username;
  console.log("Client Connected: " + socket.id, username);
  io.emit("active", { username, activeStatus: true });
  updateUserActiveStatus(username, "ONLINE");
  //Subscribed
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

  userSocketMap[username] = socket;

  //CHAT
  socket.on("chat msg", (msg) => {
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
  });
  //GROUP
  socket.on("group msg", async (msg) => {
    const membersUsername = await getMembersUsername(msg);
    addMsgToGroupConversation(msg.groupId, msg);

    membersUsername.forEach((member) => {
      const memberSocket = userSocketMap[member];
      if (memberSocket) {
        memberSocket.emit("group msg", msg);
      }
      //else redis pub sub
    });

    // const receiverSocket = userSocketMap[msg?.receiver];
    // addMsgToConversation([msg.sender, msg.receiver], {
    //   text: msg.text,
    //   sender: msg.sender,
    //   receiver: msg.receiver,
    // });
    // if (receiverSocket) {
    //   receiverSocket.emit("chat msg", msg);
    // } else {
    //   const channelName = `chat_${msg.receiver}`;
    //   publish(channelName, JSON.stringify(msg));
    // }
  });

  const getMembersUsername = async (msg) => {
    const groupData = await getGroupUsersUsername(msg.groupId);
    const members = groupData?.users;
    const membersUsername = members
      ?.map((member) => member.username)
      ?.filter((member) => member !== msg?.sender);
    return membersUsername;
  };

  //DISCONNECT
  socket.on("disconnect", () => {
    io.emit("active", { username, activeStatus: false });
    updateUserActiveStatus(username, "OFFLINE");
    console.log("Client disconnected: " + socket.id);
  });
});

export default io;
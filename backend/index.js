import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import mongoDBConnection from "./db/mongoDBConnection.js";
import {
  addMsgToConversation,
  addMsgToGroupConversation,
  getGroupUsersUsername,
} from "./controllers/msgs.controller.js";
import msgsRouter from "./routes/msgs.route.js";
import { publish, subscribe } from "./redis/msgsPubSub.js";
import { updateUserActiveStatus } from "./controllers/users.controller.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`],
    credentials: true,
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`],
  },
});

const userSocketMap = {};
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
  socket.on("group msg", (msg) => {
    const membersUsername = getMembersUsername(msg.groupId);
    addMsgToGroupConversation(msg.groupId, msg);
    // console.log(membersUsername);

    // menmbersUsername.forEach((member) => {
    //   console.log(member.username);
    // });

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

  const getMembersUsername = async (groupId) => {
    const membersUsername = await getGroupUsersUsername(groupId);
    return membersUsername;
  };

  //DISCONNECT
  socket.on("disconnect", () => {
    io.emit("active", { username, activeStatus: false });
    updateUserActiveStatus(username, "OFFLINE");
    console.log("Client disconnected: " + socket.id);
  });
});
app.use("/msgs", msgsRouter);

app.get("/", (req, res) => {
  return res.send("<html>Welcome to the chat application</html>");
});

server.listen(PORT, () => {
  mongoDBConnection();
  console.log(
    `Chat backend server is running on ${process.env.BE_HOST}:${PORT}`
  );
});

import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import mongoDBConnection from "./db/mongoDBConnection.js";
import msgsRouter from "./routes/msgs.route.js";
import { updateUserActiveStatus } from "./controllers/users.controller.js";
import {
  chatMsgEvent,
  groupMsgEvent,
  notificationEvent,
  subscribedToUsername,
} from "./websocket/websocket.js";

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
  userSocketMap[username] = socket;

  //Active status to all connected users
  io.emit("active", { username, activeStatus: true });
  updateUserActiveStatus(username, "ONLINE");

  //Subscribed
  subscribedToUsername(username, socket);

  //CHAT Event
  socket.on("chat msg", chatMsgEvent(userSocketMap));

  //GROUP Event
  socket.on("group msg", groupMsgEvent(userSocketMap));

  //Notification Event
  socket.on("notification", notificationEvent(userSocketMap));

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

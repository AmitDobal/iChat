import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("Clien Connected: " + socket.id);

  const username = socket.handshake.query.username;
  console.log("Username: ", username);

  userSocketMap[username] = socket;

  socket.on("chat msg", (msg) => {
    const receiverSocket = userSocketMap[msg?.receiver];
    console.log(msg.textMsg, msg.sender, msg.receiver);
    if (receiverSocket) receiverSocket.emit("chat msg", msg);
  });
});

app.get("/", (req, res) => {
  return res.send("<html>Welcome to the chat application</html>");
});

server.listen(PORT, () => {
  console.log(`Chat backend server is running on http://localhost:${PORT}`);
});

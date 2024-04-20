import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoDBConnection from "./db/mongoDBConnection.js";
import { addMsgToConversation } from "./controllers/msgs.controller.js";
import msgsRouter from "./routes/msgs.route.js";

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
    console.log("MMMSGGGG: ", JSON.stringify(msg))
    if (receiverSocket) {
      addMsgToConversation([msg.sender, msg.receiver], {
        text: msg.text,
        sender: msg.sender,
        receiver: msg.receiver,
      });
      receiverSocket.emit("chat msg", msg);
    }
  });
});
app.use('/msgs', msgsRouter)

app.get("/", (req, res) => {
  return res.send("<html>Welcome to the chat application</html>");
});

server.listen(PORT, () => {
  mongoDBConnection();
  console.log(`Chat backend server is running on http://localhost:${PORT}`);
});

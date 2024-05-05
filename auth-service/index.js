import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import mongoDBConnection from "./db/mongoDBConnection.js";
import authRouter from "./routes/auth.route.js";
import usersRouter from "./routes/users.route.js";

import http from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`, `${process.env.BE_HOST}:8080`],
    credentials: true,
  })
);

//remove
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

// user - socket
// one to one messaging - sender and receiver

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("Client connected");
  const username = socket.handshake.query.username;
  console.log("Username:", username);

  userSocketMap[username] = socket;

  socket.on("chat msg", (msg) => {
    const receiverSocket = userSocketMap[msg.receiver];
    if (receiverSocket) {
      receiverSocket.emit("chat msg", msg.textMsg);
    }
    //socket.broadcast.emit('chat msg', msg.textMsg);
  });
});

//remove

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Welcome to auth service");
});

app.listen(PORT, () => {
  mongoDBConnection();
  console.log(`Auth server is running on ${process.env.BE_HOST}:${PORT}`);
});

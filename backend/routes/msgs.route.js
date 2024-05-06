import express from "express";
import {
  createGroupConversation,
  getGroupMsgsForConversation,
  getMsgsForConversation,
} from "../controllers/msgs.controller.js";

const msgsRouter = express.Router();

msgsRouter.get("/", getMsgsForConversation);
msgsRouter.get("/group", getGroupMsgsForConversation);
msgsRouter.post("/group", createGroupConversation);

export default msgsRouter;

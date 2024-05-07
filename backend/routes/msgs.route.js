import express from "express";
import {
  createGroupConversation,
  getGroupMsgsForConversation,
  getGroups,
  getMsgsForConversation,
} from "../controllers/msgs.controller.js";

const msgsRouter = express.Router();

msgsRouter.get("/", getMsgsForConversation);

msgsRouter.post("/group", createGroupConversation);
msgsRouter.get("/group", getGroupMsgsForConversation);

msgsRouter.get("/groups", getGroups);

export default msgsRouter;

import mongoose from "mongoose";

const msgSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const groupConversationSchema = mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupPic: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  msgs: [msgSchema],
});
import User from "./user.model.js";
const groupConversation = mongoose.model(
  "GroupConversation",
  groupConversationSchema
);

export default groupConversation;

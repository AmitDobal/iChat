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
  receiver: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const unreadSchema = mongoose.Schema({
  user: {
    type: String,
  },
  unreadCount: {
    type: Number,
  },
});

const conversationSchema = mongoose.Schema({
  users: [
    {
      type: String,
      required: true,
    },
  ],
  msgs: [msgSchema],
  unread: unreadSchema,
});

const conversation = mongoose.model("Conversation", conversationSchema);

export default conversation;

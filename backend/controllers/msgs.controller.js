import Conversation from "../models/chat.model.js";
import GroupConversation from "../models/groupChat.model.js";

export const addMsgToConversation = async (participants, msg) => {
  try {
    let conversation = await Conversation.findOne({
      users: { $all: participants },
    });

    if (!conversation)
      conversation = await Conversation.create({ users: participants });
    conversation.msgs.push(msg);
    await conversation.save();
  } catch (error) {
    console.log("Error addMsgToConversation:", error.message);
  }
};

export const getMsgsForConversation = async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    const participants = [sender, receiver];
    const conversation = await Conversation.findOne({
      users: { $all: participants },
    });

    if (!conversation) {
      console.log("Conversation not found");
      return res.status(200).send();
    }
    return res.status(200).json(conversation.msgs);
  } catch (error) {
    console.log("Error getMsgsForConversation: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const createGroupConversation = async (req, res) => {
  try {
    const { groupName, groupPic, users } = req.body;
    const group = await GroupConversation.create({
      groupName,
      groupPic,
      users,
    });
    await group.save();
    res.status(201).json({ groupId: group._id });
  } catch (error) {
    console.log("Error createGroupConversation:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const addMsgToGroupConversation = async (groupID, msg) => {
  try {
    let conversation = await GroupConversation.findOne({ _id: groupID });
    if (!conversation) {
      console.log("No group found ");
      return;
    }
    conversation.msgs.push(msg);
    await conversation.save();
  } catch (error) {
    console.log("Error addMsgToConversation:", error.message);
  }
};
export const getGroupMsgsForConversation = async (req, res) => {
  try {
    const { groupId } = req.query;
    const conversation = await GroupConversation.findById(groupId).populate({
      path: "users",
      select: "username profilePic",
    });
    return res.status(200).json(conversation);
  } catch (error) {
    console.log("Error getGroupMsgsForConversation: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getGroupUsersUsername = async (groupId) => {
  try {
    const usersID = await GroupConversation.findById(groupId)
      .select("users")
      .populate({ path: "users", select: "username" });
    return usersID;
  } catch (error) {
    console.log("Error getGroupUsersId: ", error.message);
    return null;
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await GroupConversation.find().populate({
      path: "users",
      select: "username profilePic",
    });
    return res.status(200).json(groups);
  } catch (error) {
    console.log("Error getGroups: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

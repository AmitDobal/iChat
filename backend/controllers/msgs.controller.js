import Conversation from "../models/chat.model.js";

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
    console.log(sender + receiver);
    const participants = [sender, receiver];
    const conversation = await Conversation.findOne({
      users: { $all: participants },
    });

    if (!conversation) {
      console.log("Conversation not found");
      return res.status(200).send();
    }
    return res.json(conversation.msgs);
  } catch (error) {
    console.log("Error getMsgsForConversation: ", error.message);
  }
};

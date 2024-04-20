import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username profilePic");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error while fetching users: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const updateUserPicUrl = async (req, res) => {
  try {
    const { username, picURL } = req.body;
    const users = await User.findOne({ username });
    if (users) users.profilePic = picURL;
    await users.save();
    res.status(200).json({ message: "PIC url successfully saved" });
  } catch (error) {
    console.log("Error while updating user's URL: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

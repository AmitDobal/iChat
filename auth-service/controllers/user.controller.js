import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username profilePic activeStatus");
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

export const updateActiveStatus = async (req, res) => {
  try {
    
    const { username, activeStatus } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user) user.activeStatus = activeStatus;
    await user.save();
    res
      .status(200)
      .json({ message: "User active status updated successfully!" });
  } catch (error) {
    console.log("Error while updating user's Active status: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { name } = req.query;
    const users = await User.find({
      username: { $regex: new RegExp(name, "i") },
    })
      .select("-password")
      .limit(5)
      .sort({ username: 1 });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error while serching the user: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error while getUserByUsername: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

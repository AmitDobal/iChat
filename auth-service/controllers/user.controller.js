import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('username');
    res.status(200).json(users);
  } catch (error) {
    console.log("Error while fetching users: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

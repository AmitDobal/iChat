import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  activeStatus: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;

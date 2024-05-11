import express from "express";
import {
  getUserByUsername,
  getUsers,
  searchUser,
  updateActiveStatus,
  updateUserPicUrl,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const usersRouter = express.Router();

usersRouter.get("/", verifyToken, getUsers);
usersRouter.post("/userpic", verifyToken, updateUserPicUrl);
usersRouter.get("/search", verifyToken, searchUser);

usersRouter.post("/activestatus", updateActiveStatus);
usersRouter.get("/user/:username", getUserByUsername);

export default usersRouter;

import express from "express";
import {
  getUsers,
  serchUser,
  updateActiveStatus,
  updateUserPicUrl,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const usersRouter = express.Router();

usersRouter.get("/", verifyToken, getUsers);
usersRouter.post("/userpic", verifyToken, updateUserPicUrl);
usersRouter.post("/activestatus", updateActiveStatus);
usersRouter.get("/search", serchUser);

export default usersRouter;

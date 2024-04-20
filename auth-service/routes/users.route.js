import express from "express";
import { getUsers, updateUserPicUrl } from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const usersRouter = express.Router();

usersRouter.get("/", verifyToken, getUsers);
usersRouter.post("/userpic", verifyToken, updateUserPicUrl);

export default usersRouter;

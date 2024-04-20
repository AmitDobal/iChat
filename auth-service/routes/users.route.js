import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const usersRouter = express.Router();

usersRouter.get("/", verifyToken, getUsers);

export default usersRouter;

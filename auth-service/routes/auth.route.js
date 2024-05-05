import express from "express";
import { jwtVerify, login, signup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.get('/verify', jwtVerify)

export default authRouter;
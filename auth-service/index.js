import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import mongoDBConnection from "./db/mongoDBConnection.js";
import authRouter from "./routes/auth.route.js";
import usersRouter from "./routes/users.route.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Welcome to auth service");
});

app.listen(PORT, () => {
  mongoDBConnection();
  console.log(`Auth server is running on http://localhost:${PORT}`);
});

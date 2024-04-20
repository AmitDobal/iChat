import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoDBConnection from "./db/mongoDBConnection.js";
import authRouter from "./routes/auth.route.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
      origin:"http://localhost:3000",
      credentials: true
  })
);
app.use(express.json());
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to auth service");
});

app.listen(PORT, () => {
  mongoDBConnection();
  console.log(`Auth server is running on http://localhost:${PORT}`);
});

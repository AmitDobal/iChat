import jwt from "jsonwebtoken";

export const generateJWTToken = (userId, username) => {
  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  return token;
};

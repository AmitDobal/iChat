import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log("Error while verifing the JWT token: ", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;

import mongoose from "mongoose";

const mongoDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB")
  } catch (error) {
    console.log("Error while connecting to mongoDB: ", error.message);
  }
};

export default mongoDBConnection;

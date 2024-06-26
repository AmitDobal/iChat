import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const USERS_API = `${process.env.AUTH_SERVICE_HOST}/users`;
const ACTIVE_STATUS_API = `${process.env.AUTH_SERVICE_HOST}/users/activestatus`;

export const updateUserActiveStatus = async (username, status) => {
  try {
    let activeStatus = 0;
    if (status === "OFFLINE") activeStatus = 0;
    if (status === "ONLINE") activeStatus = 1;
    await axios.post(ACTIVE_STATUS_API, { username, activeStatus });
  } catch (error) {
    console.log(
      "error while updating the status ",
      ACTIVE_STATUS_API,
      "this is mesg"
    );
  }
};

export const getUserByUsername = async (username) => {
  try {
    const res = await axios.get(`${USERS_API}/user/${username}`);
    return res.data;
  } catch (error) {
    console.log("error while getUserByUsername ", USERS_API, error.message);
    return null;
  }
};

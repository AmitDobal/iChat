import axios from "axios";
const ACTIVE_STATUS_API = `${process.env.AUTH_SERVICE_HOST}/users/activestatus`;

export const updateUserActiveStatus = async (username, status) => {
  try {
    let activeStatus = 0;
    if (status === "OFFLINE") activeStatus = 0;
    if (status === "ONLINE") activeStatus = 1;
    const res = await axios.post(ACTIVE_STATUS_API, { username, activeStatus });
    console.log("UPDATEDDDD ACTIVE STATUS: ", username, activeStatus, res.data);
  } catch (error) {
    console.log("error while updating the status ", error.message);
  }
};

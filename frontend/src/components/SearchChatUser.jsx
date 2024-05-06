import { AutoComplete } from "antd";
import axios from "axios";
import React, { useState } from "react";
import ChatUser from "./ChatUser";

const SearchChatUser = ({ width = "auto", setUsersAdded }) => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const handleSelect = (value) => {
    const selectedUser = searchedUsers?.find((user) => user._id === value);
    setUsersAdded((prevUsers) => [...prevUsers, selectedUser]);
    setOptions([]);
    setValue("");
  };

  const handleSearch = async (searchText) => {
    if (searchText?.length > 0) {
      const users = await getSearchedUser(searchText);
      setSearchedUsers(users);
      const usernames = users?.map((user) => ({
        value: `${user._id}`,
        label: (
          <ChatUser
            id={user._id}
            username={user.username}
            profilePic={user.profilePic}
          />
        ),
      }));
      setOptions(usernames);
    } else {
      setOptions([]);
    }
    setValue(searchText);
  };

  const getSearchedUser = async (searchText) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_GET_USERS_URL}/search?name=${searchText}`
      );
      return res.data;
    } catch (error) {
      console.error("Error while searching the user: ", error.message);
    }
  };
  const handleBlur = () => {
    setOptions([]); // Reset options when blurred
  };

  return (
    <div>
      <AutoComplete
        value={value}
        options={options}
        style={{ width }}
        onSelect={handleSelect}
        onSearch={handleSearch}
        onBlur={handleBlur}
        size="large"
        placeholder="Search User"
      />
    </div>
  );
};

export default SearchChatUser;

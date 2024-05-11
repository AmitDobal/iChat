import { Button, Modal, Tag, message } from "antd";
import React, { useState } from "react";
import UserSearchChipContainer from "../Search/UserSearchChipContainer";
import { MdOutlineAddBox } from "react-icons/md";
import axios from "axios";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useGroupsStore } from "@/zustand/useGroupsStore";

const GroupModal = () => {
  const [input, setInput] = useState({
    groupName: "",
    groupPic: "",
  });
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [usersAdded, setUsersAdded] = useState([]);

  const { authId } = useAuthStore();
  const { groups, updateGroups } = useGroupsStore();

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    createGroup();
  };

  const createGroup = async () => {
    try {
      const body = { ...input, users: [...usersAdded, { _id: authId }] };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}/msgs/group`,
        body
      );
      console.log("Created Group ID: ", res.data);
      setOpen(false);
      setConfirmLoading(false);
      setInitialState();
      if (res.status === 201) updateGroups([...groups, res?.data]);
      message.success("Group created successfully!");
    } catch (error) {
      console.error("Error while creating the group", error.message);
      setConfirmLoading(false);
      message.error("Group not created!");
    }
  };
  const handleCancel = () => {
    setOpen(false);
    setInitialState();
  };
  const handleInput = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const setInitialState = () => {
    setInput({ groupName: "", groupPic: "" });
    setUsersAdded([]);
  };
  return (
    <div>
      <Button
        size="small"
        onClick={showModal}
        type="primary"
        style={{
          backgroundColor: "green",
          color: "white",
          width: 80,
          borderRadius: 5,
        }}>
        <div className="flex justify-center items-center gap-2">
          <MdOutlineAddBox />
          Create
        </div>
      </Button>
      <Modal
        title="Create Group"
        okText="Create"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
        <div>
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            {/* <div class="mb-6">
              <label
                htmlFor="groupName"
                class="block mb-2 text-sm font-medium text-white dark:text-white">
                Group Name
              </label>
              <input
                onChange={handleInput}
                value={input?.groupName}
                type="text"
                name="groupName"
                id="groupName"
                className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:focus:border-blue-500  focus:outline-none  focus:border-blue-600"
                placeholder="Group Name"
                required
              />
            </div> */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={handleInput}
                value={input?.groupName}
                type="text"
                name="groupName"
                id="groupName"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="groupName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Group Name
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={handleInput}
                value={input?.groupPic}
                type="text"
                name="groupPic"
                id="groupPic"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
              />
              <label
                htmlFor="groupPic"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Picture URL
              </label>
            </div>
            <div className="flex flex-col h-40 gap-2">
              <UserSearchChipContainer
                usersAdded={usersAdded}
                setUsersAdded={setUsersAdded}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default GroupModal;

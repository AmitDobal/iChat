import React, { useEffect, useState } from "react";
import { Input, Modal, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuthStore } from "@/zustand/useAuthStore";

const ProfileAvatart = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updatedPicURL, setUpdatedPicURL] = useState(null);

  const { authName, authPicURL } = useAuthStore();

  useEffect(() => {}, [imageUrl]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    saveImageURL();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    setImageUrl(e.target.value);
  };

  const saveImageURL = async () => {
    try {
      setConfirmLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_USERS_API}/userpic`,
        {
          username: authName,
          picURL: imageUrl,
        },
        {
          withCredentials: true,
        }
      );
      setIsModalVisible(false);
      setConfirmLoading(false);
      setUpdatedPicURL(imageUrl);
      setImageUrl("");
    } catch (error) {
      setConfirmLoading(false);
      console.log("saveImage url error: ", error.message);
    }
  };
  const picURL = () => {
    if (updatedPicURL) return updatedPicURL;
    if (authPicURL) return authPicURL;
    return "https://img.freepik.com/premium-vector/secret-agent-icon-flat-vector-call-person-headset-center-isolated_98396-60823.jpg?w=740";
  };
  return (
    <>
      <img
        src={picURL()}
        alt="Avatar"
        className="rounded-full w-20 h-20 object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <Tooltip title="Edit avatar">
          <EditOutlined
            onClick={showModal}
            style={{ color: "white", fontSize: "24px" }}
          />
        </Tooltip>
      </div>
      <Modal
        title="Edit Avatar"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}>
        <Input
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={handleChange}
        />
      </Modal>
    </>
  );
};

export default ProfileAvatart;

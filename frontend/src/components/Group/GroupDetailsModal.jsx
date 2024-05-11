import { Modal } from "antd";
import React from "react";

const GroupDetailsModal = ({ open, setOpen }) => {
  const handleCancel = () => {
    setOpen(false);
  };
  return <Modal open={open} onCancel={handleCancel} >GroupDetailsModal</Modal>;
};

export default GroupDetailsModal;

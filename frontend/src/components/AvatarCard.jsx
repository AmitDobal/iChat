import React from "react";
import { useRouter } from "next/navigation";
import ProfileAvatar from "./ProfileAvatar";

const AvatarCard = ({ authName }) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
      <div className="relative inline-block">
        <ProfileAvatar />
      </div>

      <div className="text-sm font-semibold mt-2">{authName}</div>
      <div className="text-xs text-gray-500">Software Developer</div>

      <div className="flex flex-row items-center mt-3">
        <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
          <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
        </div>
        <div className="leading-none ml-1 text-xs">Active</div>
        <div className="leading-none ml-1 text-xs text-cyan-50  bg-red-500 rounded-md h-2 p-3 flex justify-center items-center">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCard;

"use client";
import { useAuthStore } from "@/zustand/useAuthStore";
import { message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { updateAuthName, updatePicURL } = useAuthStore();

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!isUsernamePwdValid()) return;
      const res = await axios.post(
        process.env.NEXT_PUBLIC_AUTH_SIGNUP_API,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      if (res.status === 201) {
        updateAuthName(username);
        message.success("Signup successfull!");
        router.replace("/chat");
      }
    } catch (error) {
      console.log("Signup failed:", error.message);
      if (error.response?.status === 409)
        message.error("Username already exist!", 5);
      else message.error(error.message);
    }
  };
  //LOGIN
  const handleLogin = async () => {
    try {
      if (!isUsernamePwdValid()) return;
      const res = await axios.post(
        process.env.NEXT_PUBLIC_AUTH_LOGIN_API,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        updateAuthName(username);
        console.log(res.data.profilePic);
        updatePicURL(res.data.profilePic);
        message.success("Login successfull!");
        router.replace("/chat");
      }
    } catch (error) {
      console.log("Login failed:", error.message);
      if (error.response?.status === 401)
        message.error("Username or Password Incorrect!", 5);
      else message.error(error.message);
    }
  };

  const isUsernamePwdValid = () => {
    if (username && password) return true;
    message.error("Username or password should not be empty.");
  };

  return (
    <>
      <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        {/* <Toast /> */}
        <div class="relative py-3 sm:max-w-xl sm:mx-auto">
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div class="max-w-md mx-auto">
              <div>
                <h1 class="text-2xl font-semibold flex gap-2">
                  <HiMiniChatBubbleLeftRight />
                  iChat
                </h1>
              </div>
              <div class="divide-y divide-gray-200">
                <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autocomplete="off"
                      id="username"
                      name="username"
                      type="text"
                      class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Username"
                    />
                    <label
                      for="username"
                      class="absolute left-0 -top-3.5 text-gray-400 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Username
                    </label>
                  </div>
                  <div class="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autocomplete="off"
                      id="password"
                      name="password"
                      type="password"
                      class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Password"
                    />
                    <label
                      for="password"
                      class="absolute left-0 -top-3.5 text-gray-400 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Password
                    </label>
                  </div>
                  <div class="relative gap-4 flex justify-between align-middle">
                    <button
                      onClick={handleSignup}
                      class="bg-cyan-500 text-white rounded-md px-2 py-1 w-28">
                      Signup
                    </button>
                    <button
                      onClick={handleLogin}
                      class="bg-indigo-400 text-white rounded-md px-2 py-1 w-28">
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;

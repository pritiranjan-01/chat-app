import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";

import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import { createRoomApi, joinChatApi } from "../service/RoomService";
import { BiMoon, BiSun } from "react-icons/bi";
const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const {
    roomId,
    userName,
    setRoomId,
    setCurrentUser,
    setConnected,
    darkMode,
    setDarkMode,
  } = useChatContext();

  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      //join chat
      try {
        const res = await joinChatApi(detail.roomId);
        const room = res.data;
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          toast.error(error.response.data.message || "Invalid Room ID");
        } else {
          toast.error("Error in joining room");
        }
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      //create room
      // call api to create room on backend
      try {
        const response = await createRoomApi({
          roomId: detail.roomId,
        });

        toast.success("Room Created Successfully !!");
        //join the room
        setCurrentUser(detail.userName);
        setRoomId(response.data.roomId);
        setConnected(true);

        navigate("/chat");

        //forward to chat page...
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          toast(
            `⚠️ ${error.response.data?.message}` || "⚠️ Room already exists",
          );
        } else {
          toast.error("Error in creating room");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col gap-5 items-center justify-center ">
      <div className="fixed right-4 top-6 sm:right-10 sm:top-10 p-1 rounded-full cursor-pointer">
        {darkMode ? (
          <BiSun
            className="text-black -200 dark:text-white"
            size={30}
            onClick={() => setDarkMode(false)}
          />
        ) : (
          <BiMoon
            className="text-black -200 dark:text-white"
            size={30}
            onClick={() => setDarkMode(true)}
          />
        )}
      </div>
      <div className="p-8 sm:p-10 dark:border-gray-700 border w-11/12 sm:w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
        <div>
          <img src={chatIcon} className="w-24 mx-auto" />
        </div>

        <h1 className="text-2xl font-semibold text-center ">
          Join Room / Create Room ..
        </h1>
        {/* name div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Your name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            placeholder="Enter the name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* room id div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Room ID / New Room ID
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            type="text"
            id="name"
            placeholder="Enter the room id"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* button  */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={joinChat}
            className="px-3 py-2 font-bold bg-blue-500 hover:bg-blue-800 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="px-3 py-2 font-bold bg-orange-500 hover:bg-orange-800 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;

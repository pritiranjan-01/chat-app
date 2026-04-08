import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";

import { timeAgo } from "../config/helper";
import { getMessagess } from "../service/RoomService";
import { BiMoon, BiSun } from "react-icons/bi";
const ChatPage = () => {
  const avator = [
    "https://www.svgrepo.com/show/382109/male-avatar-boy-face-man-user-7.svg",
    "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
    "https://cdn-icons-png.flaticon.com/512/3675/3675805.png",
  ];

  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
    darkMode,
    setDarkMode,
  } = useChatContext();


  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const inputElement = useRef();
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  //page init:
  //page init:

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await getMessagess(roomId);
        const messages = res.data;
        setMessages(messages);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }
    if (connected && roomId) {
      loadMessages();
    }
  }, [roomId, connected]);

  //scroll down

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //stompClient ko init karne honge
  //subscribe

  useEffect(() => {
    let client = null;

    const connectWebSocket = () => {
      ///SockJS
      const sock = new SockJS(`${baseURL}/api/v1/chat`);
      client = Stomp.over(sock);

      client.debug = () => {};

      client.connect(
        {},
        () => {
          setStompClient(client);

          toast.success("connected");

          client.subscribe(`/topic/room/${roomId}`, (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
          });
        },
        (error) => {
          if (error) console.error("WebSocket error:", error);
        },
      );
    };

    if (connected && roomId) {
      connectWebSocket();
    }

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [roomId, connected]);

  //send message handle

  const sendMessage = async () => {
    const input = inputElement.current.value;
    if (stompClient && connected && input.trim()) {

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message),
      );
      inputElement.current.value = "";
    }

    //
  };

  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className="">
      {/* this is a header */}
      <header className="bg-white dark:border-gray-700 fixed w-full dark:bg-gray-900 py-3 sm:py-4 shadow flex justify-between px-4 sm:px-10 items-center z-10">
        
        {/* Left Side: Room & User details */}
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-5">
          <h1 className="text-sm sm:text-xl font-semibold text-gray-800 dark:text-white">
            Room: <span>{roomId}</span>
          </h1>
          <h1 className="text-sm sm:text-xl font-semibold text-gray-800 dark:text-white">
            User: <span>{currentUser}</span>
          </h1>
        </div>

        {/* Right Side: Actions */}
        <div className="flex gap-3 items-center">
          <div className="cursor-pointer p-1 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-full border dark:border-gray-700 text-gray-800 dark:text-white shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700">
            {darkMode ? (
              <BiSun size={24} onClick={() => setDarkMode(false)} />
            ) : (
              <BiMoon size={24} onClick={() => setDarkMode(true)} />
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-sm sm:text-base text-white dark:bg-red-500 dark:hover:bg-red-700 px-4 py-2 rounded-full font-medium"
          >
            Leave
          </button>
        </div>
      </header>

      <main
        ref={chatBoxRef}
        className="py-20 px-4 sm:px-10 w-full sm:w-2/3 md:w-2/3 lg:w-2/3 bg-gray-50 border-x dark:border-none dark:bg-slate-600 mx-auto h-screen overflow-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            } `}
          >
            <div
              className={`my-2 ${
                message.sender === currentUser
                  ? "bg-blue-700 text-white dark:bg-green-800"
                  : "bg-white text-gray-800 border dark:border-none dark:bg-gray-800 dark:text-white"
              } p-2 max-w-xs rounded shadow-sm`}
            >
              <div className="flex flex-row gap-2">
                <img
                  className="h-10 w-10 rounded-full"
                  src={avator[Math.floor(Math.random() * avator.length)]}
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-400">
                    {timeAgo(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
      {/* input message container */}
      <div className=" fixed bottom-4 w-full h-16 ">
        <div className="h-full pr-4 sm:pr-10 gap-4 flex items-center justify-between rounded-full w-11/12 sm:w-2/3 md:w-1/2 mx-auto bg-white shadow-md dark:shadow-none dark:bg-gray-900 border dark:border-none">
          <input
            ref={inputElement}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="w-full bg-gray-50 text-gray-800 border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-5 py-2 rounded-full h-full focus:outline-none"
          />

          <div className="flex gap-1">
            {/* Attach File */}
            {/* <button className="bg-purple-500 hover:bg-purple-600 text-white h-10 w-10 flex justify-center items-center rounded-full dark:bg-purple-600">
              <MdAttachFile size={20} />
            </button> */}
            <button
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 text-white h-10 w-10 flex justify-center items-center rounded-full dark:bg-green-600"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

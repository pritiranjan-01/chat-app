import React, { useEffect, useRef, useState } from "react";
import useChatContext from "../../context/ChatContext";
import { useNavigate, useParams } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessagesApi, getRoomApi, leaveRoomApi, joinRoomApi } from "../../service/RoomService";
import { baseURL } from "../../config/AxiosHelper";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import RoomSidebar from "./RoomSidebar";

const ChatPage = () => {
  const { id: roomId } = useParams();
  const { user, token, isLoggedIn, connected, setConnected } = useChatContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [room, setRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 640);
  const inputRef = useRef();
  const chatBoxRef = useRef();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  // Fetch room details and ensure membership
  useEffect(() => {
    if (!roomId || !isLoggedIn) return;

    const initRoom = async () => {
      try {
        // Ensure user is in the room (handles membership vanishing on page refresh)
        await joinRoomApi(roomId);
        const res = await getRoomApi(roomId);
        setRoom(res.data);
      } catch (err) {
        // If join fails, still try to fetch room
        getRoomApi(roomId)
          .then((res) => setRoom(res.data))
          .catch(() => {});
      }
    };

    initRoom();
  }, [roomId, isLoggedIn]);

  // Load message history
  useEffect(() => {
    if (!roomId || !isLoggedIn) return;
    getMessagesApi(roomId)
      .then((res) => setMessages(res.data || []))
      .catch(() => toast.error("Failed to load messages"));
  }, [roomId, isLoggedIn]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (!roomId || !isLoggedIn || !token) return;
    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);
    client.debug = () => {};
    client.connect(
      { Authorization: token },
      () => {
        setStompClient(client);
        setConnected(true);
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
        client.subscribe("/topic/rooms/updates", (msg) => {
          const updatedRoom = JSON.parse(msg.body);
          if (updatedRoom.id === roomId) setRoom(updatedRoom);
        });
      },
      (err) => {
        console.error("WS error:", err);
        toast.error("Connection failed");
      }
    );
    return () => {
      if (client?.connected) { client.disconnect(); setConnected(false); }
    };
  }, [roomId, isLoggedIn, token, setConnected]);

  // Keepalive leave on tab close
  useEffect(() => {
    if (!roomId || !token) return;
    const handleUnload = () => {
      fetch(`${baseURL}/room/${roomId}/leave`, {
        method: "DELETE",
        keepalive: true,
        headers: { Authorization: token, "Content-Type": "application/json" },
      }).catch(() => {});
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [roomId, token]);

  function sendMessage() {
    const content = inputRef.current?.value?.trim();
    if (!stompClient || !connected || !content) return;
    stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify({ senderId: user.id, content, roomId }));
    inputRef.current.value = "";
  }

  async function handleLeave() {
    try {
      await leaveRoomApi(roomId);
    } catch {
      // The websocket disconnect/route change should still complete if leave fails.
    }
    stompClient?.disconnect();
    setConnected(false);
    navigate("/");
  }

  return (
    <div className="h-[100dvh] flex flex-col dark:bg-gray-950 bg-gray-100 overflow-hidden">
      <ChatHeader
        room={room}
        connected={connected}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onLeave={handleLeave}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <MessageList messages={messages} currentUser={user} chatBoxRef={chatBoxRef} room={room} />
        {sidebarOpen && <RoomSidebar room={room} currentUser={user} />}
      </div>

      <MessageInput inputRef={inputRef} onSend={sendMessage} user={user} />
    </div>
  );
};

export default ChatPage;

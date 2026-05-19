import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useChatContext from "../../context/ChatContext";
import { getRoomsApi, joinRoomApi, createRoomApi, deleteRoomApi } from "../../service/RoomService";
import { baseURL } from "../../config/AxiosHelper";
import toast from "react-hot-toast";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import AuthModal from "../auth/AuthModal";
import UserMenu from "../user/UserMenu";
import HeroSection from "./HeroSection";
import RoomGrid from "./RoomGrid";
import CreateRoomModal from "./CreateRoomModal";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const stompRef = useRef(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRoomId, setPendingRoomId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ roomName: "", roomDescription: "", roomSize: 10 });
  const [creating, setCreating] = useState(false);

  const { isLoggedIn, logout, setRoomId, setConnected } = useChatContext();
  const navigate = useNavigate();

  function loadRooms() {
    getRoomsApi()
      .then((res) => setRooms(res.data || []))
      .catch(() => toast.error("Failed to load rooms"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadRooms(); toast.success("Toast works!"); }, []);

  // Real-time room updates via STOMP
  useEffect(() => {
    const token = localStorage.getItem("token");
    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);
    client.debug = () => {};
    const headers = token ? { Authorization: token } : {};
    client.connect(headers, () => {
      stompRef.current = client;
      client.subscribe("/topic/rooms/updates", (msg) => {
        const updatedRoom = JSON.parse(msg.body);
        setRooms((prev) =>
          updatedRoom.deleted
            ? prev.filter((r) => r.id !== updatedRoom.id)
            : prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
        );
      });
    });
    return () => { if (client?.connected) client.disconnect(); };
  }, []);

  function handleCreateRoomClick() {
    if (!isLoggedIn) { setPendingAction("create"); setShowAuthModal(true); return; }
    setShowCreateModal(true);
  }

  async function handleRoomClick(room) {
    if (!isLoggedIn) { setPendingRoomId(room.id); setShowAuthModal(true); return; }
    try {
      await joinRoomApi(room.id);
      setRoomId(room.id);
      setConnected(true);
      navigate(`/chat/${room.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join room");
    }
  }

  async function handleCleanUpRoom(room) {
    const memberCount = room.users?.length ?? room.userIds?.length ?? 0;
    if (memberCount > 0) {
      toast.error("Only empty rooms can be cleaned up");
      return;
    }

    try {
      await deleteRoomApi(room.id);
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      toast.success("Room cleaned up");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clean up room");
    }
  }

  function handleAuthSuccess({ joinedRoomId }) {
    setShowAuthModal(false);
    if (joinedRoomId) { navigate(`/chat/${joinedRoomId}`); return; }
    if (pendingAction === "create") {
      setPendingAction(null); setPendingRoomId(null); setShowCreateModal(true); return;
    }
    setPendingRoomId(null); setPendingAction(null);
  }

  async function handleCreateRoom(e) {
    e.preventDefault();
    if (!createForm.roomName.trim()) { toast.error("Room name is required"); return; }
    setCreating(true);
    try {
      const res = await createRoomApi(
        createForm.roomName.trim(),
        createForm.roomDescription.trim(),
        createForm.roomSize
      );
      toast.success("Room created!");
      setCreateForm({ roomName: "", roomDescription: "", roomSize: 10 });
      setShowCreateModal(false);
      setRooms((prev) => [res.data, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="bg-smart min-h-screen">
      {/* Fixed decorative bg layers — rendered behind all content */}
      <div className="bg-orb3" aria-hidden="true" />
      <div className="bg-scanline" aria-hidden="true" />

      {/* Modals — portals sit above everything via z-50 */}
      {showAuthModal && (
        <AuthModal
          onClose={() => { setShowAuthModal(false); setPendingRoomId(null); setPendingAction(null); }}
          onSuccess={handleAuthSuccess}
          pendingRoomId={pendingRoomId}
        />
      )}
      {showCreateModal && (
        <CreateRoomModal
          form={createForm}
          onChange={(field, value) => setCreateForm((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleCreateRoom}
          onClose={() => setShowCreateModal(false)}
          creating={creating}
        />
      )}

      {/* Visible page content — z-index via page-content class */}
      <div className="page-content min-h-[100dvh] flex flex-col">
        <HeroSection 
          isLoggedIn={isLoggedIn} 
          onAuthClick={() => setShowAuthModal(true)}
          onLogout={() => { logout(); toast.success("Logged out"); }}
        />

        <main className="max-w-5xl mx-auto px-4 pb-16 flex-1 flex flex-col w-full mt-4">
          <RoomGrid
            rooms={rooms}
            loading={loading}
            onRoomClick={handleRoomClick}
            onCleanUpRoom={handleCleanUpRoom}
            onCreateRoom={handleCreateRoomClick}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;

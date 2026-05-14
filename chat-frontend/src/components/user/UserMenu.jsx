import React, { useEffect, useRef, useState } from "react";
import {
  MdPerson,
  MdSettings,
  MdLogout,
  MdChevronRight,
  MdCode,
} from "react-icons/md";
import useChatContext from "../../context/ChatContext";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";

const UserMenu = ({ onLogout }) => {
  const { user } = useChatContext();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef();

  function closeModals() {
    setShowProfile(false);
    setShowSettings(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {showProfile && <ProfileModal onClose={closeModals} />}
      {showSettings && <SettingsModal onClose={closeModals} />}

      <div ref={menuRef} className="relative">
        {/* Trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/8 hover:bg-cyan-400/15 transition group"
        >
          <div className="relative flex-shrink-0">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-cyan-400/60"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold border border-cyan-400/60">
                {user?.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2) || "?"}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-cyan-400 max-w-[120px] truncate group-hover:text-cyan-300 transition">
            {user?.name}
          </span>
          <MdChevronRight
            size={16}
            className={`text-cyan-400 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-90" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-52 glass rounded-xl shadow-2xl border border-white/10 py-1.5 z-50 animate-fade-in">
            <div className="px-4 py-3 border-b border-white/8">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  setShowSettings(false);
                  setShowProfile(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 transition"
              >
                <MdPerson size={17} className="text-blue-400" />{" "}
                Profile
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setShowProfile(false);
                  setShowSettings(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 transition"
              >
                <MdSettings size={17} className="text-blue-400" />{" "}
                Settings
              </button>
            </div>

            <div className="pt-1 border-t border-white/8">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-white hover:bg-red-500/20 transition"
              >
                <MdLogout size={17} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserMenu;

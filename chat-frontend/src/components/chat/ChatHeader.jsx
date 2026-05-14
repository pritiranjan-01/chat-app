import React from "react";
import { MdArrowBack, MdInfo } from "react-icons/md";

/**
 * Top bar for the chat page.
 * Shows room name, member count, connection status, and action buttons.
 */
const ChatHeader = ({
  room,
  connected,
  sidebarOpen,
  onToggleSidebar,
  onLeave,
}) => {
  const memberCount = room?.users?.length ?? room?.userIds?.length ?? 0;

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm z-10">
      {/* Left: back + room name */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onLeave}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition flex-shrink-0"
        >
          <MdArrowBack size={20} />
        </button>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 dark:text-white truncate text-sm sm:text-base">
            {room?.roomName || "Loading..."}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {memberCount} member{memberCount !== 1 ? "s" : ""} -{" "}
            <span className="text-green-400">
              {connected ? "Connected" : "Connecting..."}
            </span>
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Toggle sidebar */}
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-full transition ${
            sidebarOpen
              ? "bg-blue-500 text-white hover:bg-blue-800"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-500"
          }`}
          title="Toggle room info"
        >
          <MdInfo size={18} />
        </button>

        <button
          onClick={onLeave}
          className="hidden sm:block px-4 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition"
        >
          Leave
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;

import React from "react";
import { MdSend } from "react-icons/md";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2);
}

/**
 * Fixed message input bar at the bottom of the chat.
 * The inputRef is owned by ChatPage so it can call sendMessage directly.
 */
const MessageInput = ({ inputRef, onSend, user }) => (
  <div className="flex-shrink-0 px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
    <div className="flex gap-3 items-center max-w-4xl mx-auto">
      {/* User avatar */}
      <div className="flex-shrink-0 hidden sm:block">
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.name)}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message…"
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        className="flex-1 px-4 py-2.5 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <button
        onClick={onSend}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center transition"
      >
        <MdSend size={18} />
      </button>
    </div>
  </div>
);

export default MessageInput;

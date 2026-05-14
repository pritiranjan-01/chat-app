import React from "react";
import { timeAgo } from "../../config/helper";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Single chat message bubble.
 * Handles both "mine" (right-aligned blue) and "others" (left-aligned grey) styles.
 */
const MessageBubble = ({ msg, isOwn, user }) => (
  <div
    className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
  >
    {/* Avatar for others */}
    {!isOwn && (
      <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-1">
        {msg.senderId?.substring(0, 2).toUpperCase() || "?"}
      </div>
    )}

    <div
      className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 py-2.5 rounded-2xl ${
        isOwn
          ? "bg-blue-500 text-white rounded-br-sm"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-700 rounded-bl-sm shadow-sm"
      }`}
    >
      <p className="text-sm leading-relaxed">{msg.content}</p>
      <p
        className={`text-[10px] mt-1 ${isOwn ? "text-blue-200 text-right" : "text-gray-400"}`}
      >
        {timeAgo(msg.timestamp)}
      </p>
    </div>

    {/* Avatar for own messages */}
    {isOwn && (
      <div className="flex-shrink-0 mb-1">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
            {getInitials(user?.name)}
          </div>
        )}
      </div>
    )}
  </div>
);

export default React.memo(MessageBubble);

import React from "react";
import MessageBubble from "./MessageBubble";

/**
 * Scrollable area that renders all chat messages.
 * Scroll management (ref + auto-scroll) lives in ChatPage.
 */
const MessageList = ({ messages, currentUser, chatBoxRef, room }) => {
  const members = room?.users || [];

  return (
    <main
      ref={chatBoxRef}
      className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-2"
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 dark:text-gray-600 text-sm">
            No messages yet. Say hello 👋
          </p>
        </div>
      )}
      {messages.map((msg, i) => {
        const isOwn = msg.senderId === currentUser?.id;
        const senderUser = isOwn ? currentUser : members.find((m) => m.id === msg.senderId);

        return (
          <MessageBubble
            key={msg.id || i}
            msg={msg}
            isOwn={isOwn}
            user={senderUser}
          />
        );
      })}
    </main>
  );
};

export default MessageList;

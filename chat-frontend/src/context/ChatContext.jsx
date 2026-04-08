import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(() => sessionStorage.getItem("roomId") || "");
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem("currentUser") || "");
  const [connected, setConnected] = useState(() => sessionStorage.getItem("connected") === "true");
  const [darkMode, setDarkMode] = useState(() => sessionStorage.getItem("darkMode") !== "false");

  useEffect(() => {
    sessionStorage.setItem("roomId", roomId);
    sessionStorage.setItem("currentUser", currentUser);
    sessionStorage.setItem("connected", connected);
    sessionStorage.setItem("darkMode", darkMode);
  }, [roomId, currentUser, connected, darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        currentUser,
        connected,
        setRoomId,
        setCurrentUser,
        setConnected,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;

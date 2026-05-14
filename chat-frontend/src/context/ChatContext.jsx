import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // ── Auth state ─────────────────────────────────────────────
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ── Chat state ─────────────────────────────────────────────
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);

  // ── Auth helpers ───────────────────────────────────────────
  const login = useCallback((jwtToken, userObj) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userObj));
    setToken(jwtToken);
    setUser(userObj);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setRoomId("");
    setConnected(false);
  }, []);

  /** Call after a profile update to keep context in sync with the server response */
  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      updateUser,
      isLoggedIn: !!token,
      roomId,
      setRoomId,
      connected,
      setConnected,
    }),
    [token, user, login, logout, updateUser, roomId, connected],
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;

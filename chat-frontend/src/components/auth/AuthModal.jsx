import React, { useState } from "react";
import { MdClose, MdMeetingRoom } from "react-icons/md";
import useChatContext from "../../context/ChatContext";
import { loginApi, getMyProfileApi, registerApi } from "../../service/AuthService";
import { joinRoomApi } from "../../service/RoomService";
import toast from "react-hot-toast";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/**
 * AuthModal — manages view state (login | register) and all auth logic.
 * Renders LoginForm or RegisterForm as pure UI sub-components.
 *
 * Props:
 *   onClose()                   — dismiss the modal
 *   onSuccess({ joinedRoomId }) — called after successful auth
 *   pendingRoomId               — room to auto-join after login
 */
const AuthModal = ({ onClose, onSuccess, pendingRoomId }) => {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const { login, setRoomId, setConnected } = useChatContext();

  // ── Shared post-auth logic ──────────────────────────────────
  async function afterAuth(token) {
    localStorage.setItem("token", token);
    const profileRes = await getMyProfileApi();
    const user = profileRes.data;
    login(token, user);

    if (pendingRoomId) {
      try {
        await joinRoomApi(pendingRoomId);
        setRoomId(pendingRoomId);
        setConnected(true);
        onSuccess({ joinedRoomId: pendingRoomId });
      } catch {
        onSuccess({});
      }
    } else {
      onSuccess({});
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await loginApi(loginForm.email, loginForm.password);
      toast.success("Welcome back!");
      await afterAuth(res.data.access_token);
    } catch (err) {
      localStorage.removeItem("token");
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", regForm.name);
      fd.append("email", regForm.email);
      fd.append("password", regForm.password);
      fd.append("provider", "LOCAL");
      await registerApi(fd);
      const loginRes = await loginApi(regForm.email, regForm.password);
      toast.success("Account created! Welcome 🎉");
      await afterAuth(loginRes.data.access_token);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm glass rounded-2xl shadow-2xl animate-fade-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition"
        >
          <MdClose size={20} />
        </button>

        {/* Brand header */}
        <div className="pt-8 pb-5 px-8 text-center border-b border-white/8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MdMeetingRoom className="text-blue-400" size={26} />
            <span className="text-xl font-bold text-white">FreeVoice</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {view === "login" ? "Sign in to continue" : "Create a free account"}
          </p>
        </div>

        {view === "login" ? (
          <LoginForm
            form={loginForm}
            onChange={(field, value) => setLoginForm((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handleLogin}
            loading={loading}
            onSwitchToRegister={() => setView("register")}
          />
        ) : (
          <RegisterForm
            form={regForm}
            onChange={(field, value) => setRegForm((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handleRegister}
            loading={loading}
            onSwitchToLogin={() => setView("login")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;

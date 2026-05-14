import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MdLock, MdClose, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { changePasswordApi } from "../../service/AuthService";
import SubmitButton from "../shared/SubmitButton";
import toast from "react-hot-toast";

/** Password input with show/hide toggle */
const PasswordField = ({ label, value, onChange, show, onToggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
      >
        {show ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
      </button>
    </div>
  </div>
);

const SettingsModal = ({ onClose }) => {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!oldPw || !newPw || !confirmPw) { toast.error("All fields are required"); return; }
    if (newPw.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { toast.error("New passwords do not match"); return; }
    setSaving(true);
    try {
      await changePasswordApi(oldPw, newPw);
      toast.success("Password changed successfully!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{
        zIndex: 10000,
        backgroundColor: "rgba(2, 6, 23, 0.92)",
        backdropFilter: "blur(10px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-blue-400/25 shadow-2xl shadow-black/60 animate-fade-in"
        style={{ backgroundColor: "#111827" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-blue-300/20"
          style={{ backgroundColor: "#172554" }}
        >
          <div className="flex items-center gap-2">
            <MdLock className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-white">Settings</h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-200 hover:text-white hover:bg-white/15 transition"
            aria-label="Close settings modal"
          >
            <MdClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
          <p className="text-sm text-gray-400 -mt-1">Change your account password below.</p>
          <PasswordField label="Current Password" value={oldPw} onChange={setOldPw} show={showOld} onToggle={() => setShowOld((v) => !v)} />
          <PasswordField label="New Password" value={newPw} onChange={setNewPw} show={showNew} onToggle={() => setShowNew((v) => !v)} />
          <PasswordField label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
          <SubmitButton loading={saving} label="Update Password" loadingLabel="Saving…" />
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;

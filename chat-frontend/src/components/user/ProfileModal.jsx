import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdPerson, MdClose, MdCameraAlt } from "react-icons/md";
import useChatContext from "../../context/ChatContext";
import { updateProfileApi } from "../../service/AuthService";
import FormField from "../shared/FormField";
import SubmitButton from "../shared/SubmitButton";
import toast from "react-hot-toast";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2);
}

const ProfileModal = ({ onClose }) => {
  const { user, updateUser } = useChatContext();
  const [name, setName] = useState(user?.name || "");
  const [preview, setPreview] = useState(user?.profilePicture || null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be under 5 MB");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (file) fd.append("profilePicture", file);
      const res = await updateProfileApi(fd);
      updateUser(res.data);
      toast.success("Profile updated!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
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
            <MdPerson className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-200 hover:text-white hover:bg-white/15 transition"
            aria-label="Close profile modal"
          >
            <MdClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-7 py-6 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {preview ? (
                <img src={preview} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border-2 border-blue-400/60" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-blue-400/60">
                  {getInitials(user?.name)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg transition"
              >
                <MdCameraAlt size={14} />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 hover:bg-blue-500/20 transition"
            >
              <MdCameraAlt size={16} />
              Change Photo
            </button>
            <p className="min-h-4 text-xs text-slate-400">
              {file ? file.name : "PNG, JPG, or WEBP up to 5 MB"}
            </p>
          </div>

          <FormField
            label={<>Display Name <span className="text-red-400">*</span></>}
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormField label="Email" value={user?.email || ""} readOnly />

          <SubmitButton loading={saving} label="Save Changes" loadingLabel="Saving…" />
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;

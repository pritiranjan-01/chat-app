import React from "react";
import { MdClose, MdAdd } from "react-icons/md";
import FormField from "../shared/FormField";
import SubmitButton from "../shared/SubmitButton";

/**
 * Modal for creating a new room.
 * Props: form { roomName, roomDescription, maxSize }, onChange, onSubmit, onClose, creating
 */
const CreateRoomModal = ({
  form,
  onChange,
  onSubmit,
  onClose,
  creating,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="relative w-full max-w-sm glass rounded-2xl shadow-2xl animate-fade-in">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
      >
        <MdClose size={20} />
      </button>

      {/* Header */}
      <div className="pt-7 pb-4 px-7 border-b border-white/8">
        <h2 className="text-lg font-bold text-white">
          Create a Room
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Start a new conversation space
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="px-7 py-6 flex flex-col gap-4"
      >
        {/* Room name */}
        <FormField
          label={
            <>
              Room Name <span className="text-red-400">*</span>
            </>
          }
          type="text"
          placeholder="e.g. General Chat"
          value={form.roomName}
          onChange={(e) => onChange("roomName", e.target.value)}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description{" "}
            <span className="text-gray-600 font-normal">
              (optional)
            </span>
          </label>
          <textarea
            placeholder="What's this room about?"
            rows={2}
            value={form.roomDescription}
            onChange={(e) =>
              onChange("roomDescription", e.target.value)
            }
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition resize-none"
          />
        </div>

        {/* Group size */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Group Size{" "}
            <span className="text-gray-600 font-normal">
              (max members)
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={2}
              max={100}
              value={form.roomSize}
              onChange={(e) =>
                onChange(
                  "roomSize",
                  parseInt(e.target.value, 10) || 10,
                )
              }
              className="w-24 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition text-center font-semibold"
            />
            <div className="flex gap-1">
              {[2, 5, 10, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange("roomSize", n)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    form.roomSize === n
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SubmitButton
          loading={creating}
          label={
            <span className="flex items-center gap-1.5">
              <MdAdd size={18} /> Create Room
            </span>
          }
          loadingLabel="Creating…"
        />
      </form>
    </div>
  </div>
);

export default CreateRoomModal;

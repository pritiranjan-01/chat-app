import React, { useEffect, useState } from "react";
import { MdCleaningServices, MdPeople } from "react-icons/md";
import { assets } from "../../assets/assets";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function hue(str) {
  if (!str) return 200;
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}

/**
 * Returns avatar circle size (px) and font size based on room capacity.
 * All sizes are chosen so 2 rows fit inside the fixed 180px avatar section.
 */
function getAvatarMetrics(roomSize) {
  if (roomSize <= 3) return { size: 72, font: 20, labelSize: "11px" };
  if (roomSize <= 5) return { size: 62, font: 17, labelSize: "10px" };
  if (roomSize <= 8) return { size: 52, font: 15, labelSize: "10px" };
  if (roomSize <= 12) return { size: 44, font: 13, labelSize: "9px" };
  return { size: 36, font: 11, labelSize: "9px" };
}

const AvatarSlot = ({ user, size, font, labelSize }) => {
  const circle = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
  };

  if (user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
        }}
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            style={{
              ...circle,
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              ...circle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `hsl(${hue(user.id)}, 55%, 42%)`,
              border: "2px solid rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: 700,
              fontSize: font,
            }}
          >
            {getInitials(user.name)}
          </div>
        )}
        <span
          style={{
            fontSize: labelSize,
            color: "#6b7280",
            maxWidth: size,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {user.name?.split(" ")[0] || "—"}
        </span>
      </div>
    );
  }

  // Empty dashed placeholder
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          ...circle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.03)",
          color: "#374151",
          fontSize: font,
          userSelect: "none",
        }}
      >
        +
      </div>
      {/* <span style={{ fontSize: labelSize, color: "#374151", userSelect: "none" }}>open</span> */}
    </div>
  );
};

const RoomCard = ({ room, onClick, onCleanUp }) => {
  const users = room.users || [];
  const memberCount = users.length;
  const isEmpty = memberCount === 0;
  const maxSize =
    room.roomSize && room.roomSize > 0 ? room.roomSize : 10;
  const isFull = memberCount >= maxSize;
  const [hasCleanupDelayElapsed, setHasCleanupDelayElapsed] =
    useState(false);

  useEffect(() => {
    if (!isEmpty || !room.createdAt) return undefined;

    const createdAtMs = new Date(room.createdAt).getTime();
    const remainingMs = 3 * 60 * 1000 - (Date.now() - createdAtMs);

    const timeoutId = window.setTimeout(
      () => {
        setHasCleanupDelayElapsed(true);
      },
      Math.max(remainingMs, 0),
    );

    return () => window.clearTimeout(timeoutId);
  }, [isEmpty, room.createdAt]);

  const isCleanupAvailable =
    isEmpty && !!room.createdAt && hasCleanupDelayElapsed;

  const { size, font, labelSize } = getAvatarMetrics(maxSize);
  const slots = Array.from(
    { length: maxSize },
    (_, i) => users[i] || null,
  );

  // Gap between circles — shrink slightly for larger rooms
  const gap = maxSize <= 6 ? 12 : maxSize <= 10 ? 10 : 8;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(12,20,44,0.82)",
        border: "1px solid rgba(255,255,255,0.08)",
        width: 280,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <img
          src={assets.logo}
          alt="Room icon"
          className="flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm leading-tight truncate">
            {room.roomName || "Unnamed Room"}
          </p>
          <p className="text-xs italic text-gray-400 truncate mt-0.5 leading-tight">
            {room.roomDescription || "No description"}
          </p>
        </div>

        <div
          className="flex-shrink-0 flex items-center gap-1 text-gray-400 text-xs"
          title={`${memberCount} of ${maxSize} members`}
        >
          <MdPeople size={14} />
          <span>
            {memberCount}
            <span className="text-gray-600">/{maxSize}</span>
          </span>
        </div>
      </div>

      {/* ── Fixed-height avatar section ──────────────────────────── */}
      <div
        className="border-t border-b border-white/5 flex-1"
        style={{
          height: 180,
          padding: "12px 16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap,
            alignContent: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {isCleanupAvailable ? (
            <button
              type="button"
              onClick={onCleanUp}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:scale-105 hover:text-white active:scale-95"
              style={{
                border: "1px solid rgba(248,113,113,0.45)",
                background: "rgba(239,68,68,0.1)",
                boxShadow: "0 0 24px rgba(239,68,68,0.12)",
              }}
              title="Delete this empty room"
            >
              <MdCleaningServices size={18} />
              Clean Up
            </button>
          ) : (
            slots.map((user, i) => (
              <AvatarSlot
                key={user?.id ?? `slot-${i}`}
                user={user}
                size={size}
                font={font}
                labelSize={labelSize}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Footer CTA ───────────────────────────────────────────── */}
      <div className="px-5 py-3.5 flex items-center justify-center">
        {isFull ? (
          <div
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                       text-gray-500 cursor-not-allowed select-none"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            This group is full.
          </div>
        ) : (
          <button
            onClick={onClick}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                       text-green-400 cursor-pointer select-none
                       transition-all duration-200
                       hover:text-green-300 hover:scale-105
                       hover:shadow-[0_0_18px_rgba(74,222,128,0.35)]
                       active:scale-95"
            style={{
              border: "1px solid rgba(74,222,128,0.35)",
              background: "rgba(74,222,128,0.05)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Join chat now!
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;

import React from "react";
import { MdMeetingRoom, MdAdd } from "react-icons/md";
import RoomCard from "../room/RoomCard";

/**
 * Grid of room cards with a Create Room button above and a room count label.
 * Shows a loading spinner or an empty state when needed.
 */
const RoomGrid = ({ rooms, loading, onRoomClick, onCleanUpRoom, onCreateRoom }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Toolbar row above cards */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onCreateRoom}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/60 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 text-sm font-semibold transition"
        >
          <MdAdd size={18} />
          Create Room
        </button>
        {rooms.length > 0 && (
          <span className="text-xs text-gray-500">
            {rooms.length} room{rooms.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <MdMeetingRoom size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-gray-400">No rooms yet</p>
          <p className="text-sm mt-1">Be the first — create a room above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {rooms.map((room) => (
            <div key={room.id} className="w-full max-w-[280px]">
              <RoomCard
                room={room}
                onClick={() => onRoomClick(room)}
                onCleanUp={() => onCleanUpRoom(room)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RoomGrid;

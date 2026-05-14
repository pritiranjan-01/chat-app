import React from "react";

/**
 * Right sidebar showing room info and member list.
 * Only rendered on sm+ screens when sidebarOpen is true.
 */
const RoomSidebar = ({ room, currentUser }) => {
  const members =
    room?.users ?? (room?.userIds || []).map((id) => ({ id, name: id }));

  // Sort members so currentUser is always first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === currentUser?.id) return -1;
    if (b.id === currentUser?.id) return 1;
    return 0;
  });

  const memberCount = sortedMembers.length;

  return (
    <aside className="hidden sm:flex flex-col w-72 bg-white dark:bg-gray-900 border-l dark:border-gray-800 flex-shrink-0">
      {/* Room Info */}
      <div className="p-5 border-b dark:border-gray-800">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Room Info
        </h3>
        <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
          {room?.roomName || "-"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {room?.roomDescription || "No description."}
        </p>
      </div>

      {/* Members */}
      <div className="p-5 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Members ({memberCount})
        </h3>
        {memberCount === 0 ? (
          <p className="text-xs text-gray-400">No members yet.</p>
        ) : (
          <div className="space-y-2">
            {sortedMembers.map((member, i) => (
              <div key={member.id} className="flex items-center gap-2.5">
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={member.name || "Member"}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `hsl(${(i * 67) % 360}, 65%, 50%)` }}
                  >
                    {(member.name || member.id).substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {member.id === currentUser?.id
                      ? `${currentUser.name} (You)`
                      : member.name || `${member.id.substring(0, 12)}...`}
                  </p>
                  <p className="text-[10px] text-gray-400">Member</p>
                </div>
                {member.id === currentUser?.id && (
                  <span className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-green-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RoomSidebar;

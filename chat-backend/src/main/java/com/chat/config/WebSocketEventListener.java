package com.chat.config;

import com.chat.dto.RoomResponse;
import com.chat.dto.UserResponse;
import com.chat.entity.Room;
import com.chat.entity.User;
import com.chat.service.RoomService;
import com.chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Listens for WebSocket lifecycle events.
 *
 * SUBSCRIBE  → when a client subscribes to /topic/room/{roomId},
 *              record sessionId → {userId, roomId} in a registry.
 *
 * DISCONNECT → when any WebSocket session ends (tab close, network drop,
 *              browser crash, etc.), look up the registry and automatically
 *              remove the user from their room, then broadcast the update.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final RoomService roomService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    /** sessionId → (userId, roomId) */
    private final ConcurrentHashMap<String, SessionInfo> sessions = new ConcurrentHashMap<>();

    // ── Subscribe: register session when user enters a room ──────────
    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headers.getDestination();

        // We only care about chat room subscriptions
        if (destination == null || !destination.startsWith("/topic/room/")) return;

        String roomId  = destination.substring("/topic/room/".length());
        String sessionId = headers.getSessionId();
        Principal principal = headers.getUser();

        if (sessionId == null || principal == null) return;

        // principal.getName() is the email (set by WebSocketAuthChannelInterceptor)
        User user = userService.findByEmail(principal.getName());
        if (user != null) {
            sessions.put(sessionId, new SessionInfo(user.getId(), roomId));
            log.debug("WS session registered: session={} user={} room={}", sessionId, user.getId(), roomId);
        }
    }

    // ── Disconnect: auto-leave room when session ends ────────────────
    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        SessionInfo info = sessions.remove(sessionId);

        if (info == null) return; // guest or session was never in a room

        log.debug("WS disconnect: removing user={} from room={}", info.userId, info.roomId);

        try {
            Room room = roomService.leaveRoom(info.roomId, info.userId);
            if (room != null) {
                messagingTemplate.convertAndSend("/topic/rooms/updates", toResponse(room));
            }
        } catch (Exception e) {
            log.warn("Auto-leave failed on disconnect: {}", e.getMessage());
        }
    }

    // ── Helper ───────────────────────────────────────────────────────
    private RoomResponse toResponse(Room room) {
        List<UserResponse> users = room.getUserIds().stream()
                .map(uid -> {
                    User u = userService.findById(uid);
                    if (u == null) return null;
                    return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getProfilePicture());
                })
                .filter(Objects::nonNull)
                .toList();

        return RoomResponse.builder()
                .id(room.getId())
                .roomName(room.getRoomName())
                .roomDescription(room.getRoomDescription())
                .createdBy(room.getCreatedBy())
                .createdAt(room.getCreatedAt())
                .users(users)
                .build();
    }

    // ── Inner record ─────────────────────────────────────────────────
    private record SessionInfo(String userId, String roomId) {}
}

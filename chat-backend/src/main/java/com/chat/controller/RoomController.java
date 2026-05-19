package com.chat.controller;

import com.chat.dto.ApiResponse;
import com.chat.dto.RoomRequest;
import com.chat.dto.RoomResponse;
import com.chat.dto.UserResponse;
import com.chat.entity.Message;
import com.chat.entity.Room;
import com.chat.entity.User;
import com.chat.service.RoomService;
import com.chat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    // ── Create ────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRoom(
            @Valid @RequestBody RoomRequest roomRequest,
            Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        Room room = roomService.createRoom(roomRequest, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Room created", toResponse(room)));
    }

    // ── Get single room ───────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getRoom(@PathVariable String id) {
        Room room = roomService.findById(id);
        if (room == null) return ResponseEntity.badRequest()
                .body(ApiResponse.error("Room not found"));
        return ResponseEntity.ok(ApiResponse.success("Room found", toResponse(room)));
    }

    // ── Get all rooms ─────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Rooms fetched", rooms));
    }

    // ── Paginated messages ────────────────────────────────────
    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<?>> getMessages(
            @PathVariable String id,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        Room room = roomService.findById(id);
        if (room == null) return ResponseEntity.badRequest()
                .body(ApiResponse.error("Room not found"));

        List<Message> messages = room.getMessages();
        int end   = Math.max(0, messages.size() - page * size);
        int start = Math.max(0, end - size);
        return ResponseEntity.ok(
                ApiResponse.success("Messages fetched", messages.subList(start, end)));
    }

    // ── Join ──────────────────────────────────────────────────
    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<?>> joinRoom(
            @PathVariable String id, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("User not found"));
        try {
            Room room = roomService.joinRoom(id, user.getId());
            RoomResponse roomResponse = toResponse(room);
            // Broadcast membership change to all subscribers
            messagingTemplate.convertAndSend("/topic/rooms/updates", roomResponse);
            return ResponseEntity.ok(ApiResponse.success("Joined room", roomResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Leave ─────────────────────────────────────────────────
    @DeleteMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<?>> leaveRoom(
            @PathVariable String id, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("User not found"));
        Room room = roomService.leaveRoom(id, user.getId());
        RoomResponse roomResponse = toResponse(room);
        // Broadcast membership change to all subscribers
        messagingTemplate.convertAndSend("/topic/rooms/updates", roomResponse);
        return ResponseEntity.ok(ApiResponse.success("Left room", roomResponse));
    }

    // ── Delete ────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRoom(@PathVariable String id) {
        Room room = roomService.findById(id);
        if (room == null) return ResponseEntity.badRequest()
                .body(ApiResponse.error("Room not found"));
        roomService.deleteRoom(id);
        messagingTemplate.convertAndSend("/topic/rooms/updates", Map.of("id", id, "deleted", true));
        return ResponseEntity.ok(ApiResponse.success("Room deleted", null));
    }

    // ── Helper: Room → RoomResponse ───────────────────────────
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
                .roomSize(room.getRoomSize())
                .users(users)
                .build();
    }
}

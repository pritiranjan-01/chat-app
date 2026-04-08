package com.chat.controller;

import com.chat.dto.ApiResponse;
import com.chat.dto.RoomRequest;
import com.chat.entity.Message;
import com.chat.entity.Room;
import com.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRoom(@RequestBody RoomRequest roomRequest) {

        if (roomService.findByRoomId(roomRequest.roomId()) != null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Room already exists"));
        }
        Room room = roomService.createRoom(roomRequest.roomId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Room created", room));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<?>> getRoom(@PathVariable String roomId) {
        Room room = roomService.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Room not found "));
        }
        return ResponseEntity.ok(ApiResponse.success("Room found", room));
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<ApiResponse<?>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", required = false, defaultValue = "0") int pageNo,
            @RequestParam(value = "size", required = false, defaultValue = "20") int size
    ) {
        Room room = roomService.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Room not found "));
        }
        //Pagination
        List<Message> messages = room.getMessages();

        int end   = Math.max(0, messages.size() - pageNo * size);
        int start = Math.max(0, end - size);

        List<Message> paginatedMessage =  messages.subList(start, end);

        return ResponseEntity.ok(ApiResponse.success("Messages fetched", paginatedMessage));
    }
}

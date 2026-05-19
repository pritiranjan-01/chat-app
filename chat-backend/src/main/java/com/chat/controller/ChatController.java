package com.chat.controller;

import com.chat.dto.MessageRequest;
import com.chat.entity.Message;
import com.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import jakarta.validation.Valid;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final RoomService roomService;

    // For sending and receiving messages

    @MessageMapping("/sendMessage/{id}") // Client sends to: /app/sendMessage/{id}
    @SendTo("/topic/room/{id}")           // Server broadcasts to: /topic/room/{id}
    public Message sendMessage(
            @Valid @Payload MessageRequest request,
            @DestinationVariable String id
    ) {
        return roomService.updateRoomMessage(request);
    }
}

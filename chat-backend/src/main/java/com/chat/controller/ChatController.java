package com.chat.controller;

import com.chat.dto.MessageRequest;
import com.chat.entity.Message;
import com.chat.entity.Room;
import com.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final RoomService roomService;


    // For sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}") // Publish /app/sendMessage/{roomId}
    @SendTo("/topic/room/{roomId}") // Subscribe
    public Message sendMessage(
            @Payload  MessageRequest request,
            @DestinationVariable String roomId
    ) {
       return roomService.updateRoomMessage(request);
    }
}

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

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final RoomService roomService;


    // For sending and receiving messages

    @MessageMapping("/sendMessage/{roomId}") // Receiving a Message send from Client /app/sendMessage/{roomId}
    @SendTo("/topic/room/{roomId}") // Subscribe : Tell all the clients connected to this topic
    public Message sendMessage(
            @Payload  MessageRequest request,
            @DestinationVariable String roomId
    ) {
       return roomService.updateRoomMessage(request);
    }
}

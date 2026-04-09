package com.chat.service.impl;

import com.chat.dto.MessageRequest;
import com.chat.entity.Message;
import com.chat.entity.Room;
import com.chat.repository.RoomRepository;
import com.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public Room findByRoomId(String roomId) {
        return roomRepository.findByRoomId(roomId);
    }

    @Override
    public Room createRoom(String roomId) {
        Room room = new Room();
        room.setRoomId(roomId);
        return roomRepository.save(room);
    }

    @Override
    public Message updateRoomMessage(MessageRequest request) {
        Room room = roomRepository.findByRoomId(request.getRoomId());

        if (room != null) {
            Message message = new Message();
            message.setContent(request.getContent());
            message.setSender(request.getSender());
            message.setTimestamp(Instant.now()); // Store in UTC;

            room.getMessages().add(message);
            roomRepository.save(room);
            return message;
        }
        else {
            throw new RuntimeException("Room not found");
        }
    }
}

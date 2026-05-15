package com.chat.service.impl;

import com.chat.dto.MessageRequest;
import com.chat.dto.RoomRequest;
import com.chat.entity.Message;
import com.chat.entity.Room;
import com.chat.repository.RoomRepository;
import com.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public Room findById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    @Override
    public Room createRoom(RoomRequest request, String userId) {
        int size = (request.getRoomSize() != null && request.getRoomSize() > 0) ? request.getRoomSize() : 10;
        Room room = Room.builder()
                .roomName(request.getRoomName())
                .roomDescription(request.getRoomDescription())
                .roomSize(size)
                .createdBy(userId)
                .build();
        // MongoDB auto-generates the id on save
        return roomRepository.save(room);
    }

    @Override
    public Message updateRoomMessage(MessageRequest request) {
        Room room = roomRepository.findById(request.getRoomId()).orElse(null);

        if (room != null) {
            Message message = new Message(request.getSenderId(), request.getContent());
            room.getMessages().add(message);

            roomRepository.save(room);
            return message;
        } else {
            throw new RuntimeException("Room not found");
        }
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room joinRoom(String id, String userId) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getUserIds().size() >= room.getRoomSize()) {
            throw new RuntimeException("Room is full (max " + room.getRoomSize() + " members)");
        }
        // Idempotent: only add if not already a member
        if (!room.getUserIds().contains(userId)) {
            room.getUserIds().add(userId);
            roomRepository.save(room);
        }
        return room;
    }

    @Override
    public Room leaveRoom(String id, String userId) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.getUserIds().remove(userId);
        roomRepository.save(room);
        return room;
    }

    @Override
    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

}

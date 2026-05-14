package com.chat.service;

import com.chat.dto.MessageRequest;
import com.chat.dto.RoomRequest;
import com.chat.entity.Message;
import com.chat.entity.Room;

import java.util.List;

public interface RoomService {

    Room findById(String id);

    Room createRoom(RoomRequest request, String userId);

    Message updateRoomMessage(MessageRequest request);

    List<Room> getAllRooms();

    Room joinRoom(String id, String userId);

    Room leaveRoom(String id, String userId);

    void deleteRoom(String id);

}

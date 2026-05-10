package com.chat.service;


import com.chat.dto.MessageRequest;
import com.chat.entity.Message;
import com.chat.entity.Room;
import com.chat.entity.User;

import java.util.List;

public interface RoomService {

    Room findByRoomId(String roomId);

    Room createRoom(String roomId);

    Message updateRoomMessage(MessageRequest request);

    List<Room> getAllRooms();

    List<User> getAllUsersfromRoomByRoomId(String roomId);

}

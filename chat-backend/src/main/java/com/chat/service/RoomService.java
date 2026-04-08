package com.chat.service;


import com.chat.dto.MessageRequest;
import com.chat.entity.Message;
import com.chat.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface RoomService {

    Room findByRoomId(String roomId);

    Room createRoom(String roomId);

    Message updateRoomMessage(MessageRequest request);

}

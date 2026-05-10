package com.chat.repository;

import com.chat.entity.Room;
import com.chat.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {

    Room findByRoomId(String roomId);
    List<User> findAllByRoomId(String roomId);
}

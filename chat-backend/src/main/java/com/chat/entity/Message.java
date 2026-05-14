package com.chat.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {

    @Id
    private String id;
    private String roomId;
    private String senderId;
    private String content;
    private Instant timestamp;

    public Message(String roomId, String senderId, String content) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = Instant.now();
    }
}

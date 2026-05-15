package com.chat.entity;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {

    private String id;
    private String senderId;
    private String content;
    private Instant timestamp;

    public Message(String senderId, String content) {
        this.id = UUID.randomUUID().toString();
        this.senderId = senderId;
        this.content = content;
        this.timestamp = Instant.now();
    }
}

package com.chat.entity;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Message {

    private User sender;
    private String content;
    private Instant timestamp;

    public Message(String content, User sender) {
        this.content = content;
        this.sender = sender;
        this.timestamp = Instant.now();
    }

}

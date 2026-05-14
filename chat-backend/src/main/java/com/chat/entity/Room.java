package com.chat.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "rooms")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    private String id; // MongoDB auto-generates this as the unique room identifier

    private String roomName;
    private String roomDescription;

    /** Maximum number of concurrent members allowed in the room */
    private int roomSize;

    @Builder.Default
    private List<String> userIds = new ArrayList<>();

    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    private String createdBy;

    @CreatedDate
    private Instant createdAt;
}

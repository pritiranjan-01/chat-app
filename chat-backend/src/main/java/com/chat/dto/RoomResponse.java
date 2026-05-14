package com.chat.dto;

import lombok.*;
import java.time.Instant;
import java.util.List;

/**
 * Room response with embedded user objects instead of raw userIds.
 * Returned by GET /room and GET /room/{id} so the frontend
 * never needs extra calls to look up member profiles.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private String id;
    private String roomName;
    private String roomDescription;
    private String createdBy;
    private Instant createdAt;
    private int roomSize;

    /** Full user objects for every member (id, name, email, profilePicture) */
    private List<UserResponse> users;
}

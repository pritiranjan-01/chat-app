package com.chat.dto;

import com.chat.entity.User;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    @NotBlank(message = "Message content is required")
    private String content;

    private String senderId;

    @NotBlank(message = "Room ID is required")
    private String roomId;
}

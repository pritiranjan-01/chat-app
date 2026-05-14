package com.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * Used by PUT /user/me to update only the fields a user is allowed to change.
 * Email, password, and provider are intentionally excluded — those require
 * a dedicated flow (e.g. change-password endpoint).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String name;
    private MultipartFile profilePicture; // optional — null means keep existing
}

package com.chat.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String profilePicture;
    private String provider; // LOCAL, GOOGLE, GITHUB
    private String role;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastLoginAt;
}

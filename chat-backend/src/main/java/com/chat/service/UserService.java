package com.chat.service;

import com.chat.dto.ChangePasswordRequest;
import com.chat.dto.UpdateProfileRequest;
import com.chat.dto.UserRequest;
import com.chat.entity.User;

public interface UserService {

    User save(UserRequest userRequest);

    Void delete(String userId);

    User findByEmail(String email);

    User findById(String id);

    User updateProfile(String id, UpdateProfileRequest request);

    void changePassword(String id, ChangePasswordRequest request);
}

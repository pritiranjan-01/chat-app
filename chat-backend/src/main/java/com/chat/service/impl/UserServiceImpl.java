package com.chat.service.impl;

import com.chat.dto.ChangePasswordRequest;
import com.chat.dto.UpdateProfileRequest;
import com.chat.dto.UserRequest;
import com.chat.entity.User;
import com.chat.repository.UserRepository;
import com.chat.service.FileUploadService;
import com.chat.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, FileUploadService fileUploadService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.fileUploadService = fileUploadService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User save(UserRequest userRequest) {
        if(userRepository.findByEmail(userRequest.getEmail()).isPresent()){
            throw new RuntimeException("Email already exist");
        }
        String profilePictureUrl="https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";
        User user =  User.builder()
                .name(userRequest.getName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .profilePicture(profilePictureUrl)
                .provider(userRequest.getProvider())
                .role("ROLE_USER")
                .isActive(true)
                .build();
        return userRepository.save(user);
    }

    @Override
    public Void delete(String userId) {
        userRepository.deleteById(userId);
        return null;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User updateProfile(String id, UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only update fields that were actually provided
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
            MultipartFile profilePicture = request.getProfilePicture();
            String contentType = profilePicture.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Profile picture must be an image");
            }
            String newUrl = fileUploadService.upload(request.getProfilePicture());
            user.setProfilePicture(newUrl);
        }

        return userRepository.save(user);
    }

    @Override
    public void changePassword(String id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

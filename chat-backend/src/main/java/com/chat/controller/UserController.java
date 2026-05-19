package com.chat.controller;

import com.chat.dto.*;
import com.chat.entity.User;
import com.chat.service.UserService;
import com.chat.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // ───────────────────────── Auth ─────────────────────────

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @ModelAttribute UserRequest userRequest) {
        User res = userService.save(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("User Registration Successful", toResponse(res))
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        return ResponseEntity.ok(
                ApiResponse.success("Login Successful", new AuthResponse(jwtUtil.generateToken(request.getEmail())))
        );
    }

    // ───────────────────────── Profile ─────────────────────────

    /**
     * GET /user/me — returns the currently logged-in user's profile.
     * Identity is extracted from the JWT token via Authentication.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", toResponse(user)));
    }

    /**
     * POST /user/me — update name and/or profile picture.
     * Only the fields provided will be updated; others remain unchanged.
     */
    @RequestMapping(
            value = "/me",
            method = {RequestMethod.POST, RequestMethod.PUT},
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            Authentication authentication
    ) {
        User user = userService.findByEmail(authentication.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found"));
        }
        UpdateProfileRequest request = new UpdateProfileRequest(name, profilePicture);
        User updated = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", toResponse(updated)));
    }

    /**
     * POST /user/me/change-password — changes the authenticated user's password.
     * Requires the current password (oldPassword) for verification.
     */
    @PostMapping("/me/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        User user = userService.findByEmail(authentication.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found"));
        }
        userService.changePassword(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    /**
     * GET /user/{id} — fetch any user's public profile by their ID.
     * Password and internal fields are never exposed (we return UserResponse, not User).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("User found", toResponse(user)));
    }

    // ───────────────────────── Helper ─────────────────────────

    /** Maps a User entity to a safe UserResponse (never exposes password/role). */
    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getProfilePicture());
    }
}

package com.punarmilan.controller;

import com.punarmilan.dto.LoginRequest;
import com.punarmilan.dto.RegisterRequest;
import com.punarmilan.dto.UserResponse;
import com.punarmilan.dto.TokenRefreshRequest;
import com.punarmilan.dto.TokenRefreshResponse;
import com.punarmilan.dto.ForgotPasswordRequest;
import com.punarmilan.dto.ResetPasswordRequest;
import com.punarmilan.dto.MessageResponse;
import com.punarmilan.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.entity.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final AuthUtil authUtil;

    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true); // Always true in production
        accessCookie.setPath("/");
        accessCookie.setMaxAge(15 * 60); // 15 mins
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true); // Always true in production
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(refreshCookie);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        log.info("Registration request received for email: {}", request.getEmail());

        UserResponse authResponse = authService.register(request);
        setTokenCookies(response, authResponse.getAccessToken(), authResponse.getRefreshToken());

        log.info("Registration successful for user ID: {}", authResponse.getId());
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        log.info("Login request received for: {}", request.getEmail());

        UserResponse authResponse = authService.login(request);
        setTokenCookies(response, authResponse.getAccessToken(), authResponse.getRefreshToken());

        log.info("Login successful for user ID: {}", authResponse.getId());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request, HttpServletResponse response) {
        log.info("Token refresh request received");
        TokenRefreshResponse authResponse = authService.refreshToken(request);
        
        Cookie accessCookie = new Cookie("accessToken", authResponse.getAccessToken());
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(15 * 60);
        response.addCookie(accessCookie);
        
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = authUtil.getCurrentUser();
        // Return user info WITHOUT tokens
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .emailVerified(user.getEmailVerified())
                .mobileVerified(user.getMobileVerified())
                .createdAt(user.getCreatedAt())
                .isPremium(user.getIsPremium())
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.processForgotPassword(request);
        return ResponseEntity.ok(new MessageResponse("Password reset link has been sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletResponse response) {
        String email = authUtil.getCurrentUserEmail();
        log.info("Logout request received for email: {}", email);
        authService.logout(email);

        // Clear cookies
        Cookie accessCookie = new Cookie("accessToken", null);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}

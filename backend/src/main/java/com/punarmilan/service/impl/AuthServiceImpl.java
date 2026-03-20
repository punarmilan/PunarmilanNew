package com.punarmilan.service.impl;

import com.punarmilan.dto.*;
import com.punarmilan.entity.RefreshToken;
import com.punarmilan.entity.User;
import com.punarmilan.exception.DuplicateResourceException;
import com.punarmilan.exception.UnauthorizedException;
import com.punarmilan.repository.RefreshTokenRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.security.JwtUtils;
import com.punarmilan.service.AuthService;
import com.punarmilan.service.UserActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final com.punarmilan.service.ProfileService profileService;
    private final com.punarmilan.service.MailService mailService;
    private final UserActivityService userActivityService;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new DuplicateResourceException("Email already registered");
        }

        // Check if mobile number already exists
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            log.warn("Registration failed: Mobile number already exists - {}", request.getMobileNumber());
            throw new DuplicateResourceException("Mobile number already registered");
        }

        // Create new user
        User user = new User();
        user.setMobileNumber(request.getMobileNumber());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setMobileVerified(false);
        user.setEnabled(true);

        // Save user to database
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // Create default profile for the user immediately
        profileService.createDefaultProfile(savedUser, request.getFirstName(), request.getLastName(),
                request.getProfileCreatedBy(), request.getGender());

        String accessToken = jwtUtils.generateAccessToken(savedUser.getEmail());
        RefreshToken refreshToken = createRefreshToken(savedUser);

        // Convert to response DTO
        return UserResponse.builder()
                .id(savedUser.getId())
                .mobileNumber(savedUser.getMobileNumber())
                .email(savedUser.getEmail())
                .emailVerified(savedUser.getEmailVerified())
                .mobileVerified(savedUser.getMobileVerified())
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .profilePhotoUrl(null)
                .createdAt(savedUser.getCreatedAt())
                .isPremium(savedUser.getIsPremium())
                .build();
    }

    @Override
    @Transactional
    public UserResponse login(LoginRequest request) {
        log.info("Login attempt for: {}", request.getEmail());

        // Find user by email or mobile number using existing methods (more robust)
        User user = userRepository.findByEmail(request.getEmail())
                .or(() -> userRepository.findByMobileNumber(request.getEmail()))
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found - {}", request.getEmail());
                    return new BadCredentialsException("Invalid email/mobile or password");
                });

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid password for user - {}", request.getEmail());
            throw new BadCredentialsException("Invalid email/mobile or password");
        }

        // Check if user is enabled
        if (!user.getEnabled()) {
            log.warn("Login failed: Account disabled - {}", request.getEmail());
            throw new BadCredentialsException("Account is disabled");
        }

        log.info("Login successful for user ID: {}", user.getId());

        // Update last active status
        user.setLastActive(java.time.LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = createRefreshToken(user);

        // Convert to response DTO
        String profilePhotoUrl = null;
        try {
            profilePhotoUrl = profileService.getMyProfile(user).getProfilePhotoUrl();
        } catch (Exception e) {
            log.warn("Could not fetch profile photo for user: {}", user.getId());
        }

        return UserResponse.builder()
                .id(user.getId())
                .mobileNumber(user.getMobileNumber())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .mobileVerified(user.getMobileVerified())
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .profilePhotoUrl(profilePhotoUrl)
                .createdAt(user.getCreatedAt())
                .isPremium(user.getIsPremium())
                .build();
    }

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtUtils.generateAccessToken(user.getEmail());
                    return TokenRefreshResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(requestRefreshToken)
                            .build();
                })
                .orElseThrow(() -> new UnauthorizedException("Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public void processForgotPassword(ForgotPasswordRequest request) {
        log.info("Processing forgot password for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Forgot password failed: User not found - {}", request.getEmail());
                    return new com.punarmilan.exception.ResourceNotFoundException(
                            "User not found with email: " + request.getEmail());
                });

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        mailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        log.info("Reset token generated and email sent for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password with token: {}", request.getToken());

        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new com.punarmilan.exception.UnauthorizedException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            log.warn("Reset token expired for user: {}", user.getEmail());
            throw new com.punarmilan.exception.UnauthorizedException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken());

        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtUtils.getRefreshExpiration()));

        return refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Override
    @Transactional
    public void logout(String email) {
        log.info("Logging out user: {}", email);
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setLastActive(java.time.LocalDateTime.now().minusYears(10));
            userRepository.save(user);
            // Clear Redis cache so isOnline returns false immediately
            userActivityService.clearActivity(email);
        });
    }
}

package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;

import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.punarmilan.dto.SearchCriteriaDTO;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    // Helper to get user from Security Context
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDTO> getMyProfile() {
        log.info("Fetching profile for current user");
        User user = getCurrentUser();
        return ResponseEntity.ok(profileService.getMyProfile(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<ProfileDTO> updateProfile(@RequestBody Map<String, Object> updates) {
        log.info("Updating profile for current user with {} fields", updates.size());
        User user = getCurrentUser();
        return ResponseEntity.ok(profileService.updateProfile(user, updates));
    }

    @PostMapping("/photo")
    public ResponseEntity<ProfileDTO> uploadPhoto(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "photoIndex", defaultValue = "0") Integer photoIndex) {
        log.info("Uploading photo at index {} for current user", photoIndex);
        User user = getCurrentUser();
        return ResponseEntity.ok(profileService.uploadPhoto(user, file, photoIndex));
    }

    @DeleteMapping("/photos/{index}")
    public ResponseEntity<ProfileDTO> deletePhoto(@PathVariable("index") Integer index) {
        log.info("Deleting photo at index {} for current user", index);
        User user = getCurrentUser();
        return ResponseEntity.ok(profileService.deletePhoto(user, index));
    }

    @PostMapping("/id-proof")
    public ResponseEntity<ProfileDTO> uploadIdProof(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("idProofType") String idProofType,
            @RequestParam("idProofNumber") String idProofNumber) {
        log.info("Uploading ID proof for current user");
        User user = getCurrentUser();
        return ResponseEntity.ok(profileService.uploadIdProof(user, file, idProofType, idProofNumber));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDTO> getProfileByUserId(@PathVariable Long userId) {
        log.info("Fetching profile for user ID: {}", userId);
        User currentUser = null;
        try {
            currentUser = getCurrentUser();
        } catch (Exception e) {
            log.debug("No authenticated user for profile view ID: {}", userId);
        }
        return ResponseEntity.ok(profileService.getProfileByUserId(userId, currentUser));
    }

    @PostMapping("/search")
    public ResponseEntity<Page<ProfileDTO>> searchProfiles(
            @RequestBody SearchCriteriaDTO criteria,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Request received for profile search with criteria: {} and pageable: {}", criteria, pageable);
        User currentUser = null;
        try {
            currentUser = getCurrentUser();
        } catch (Exception e) {
            log.debug("No authenticated user for profile search");
        }
        return ResponseEntity.ok(profileService.searchProfiles(criteria, currentUser, pageable));
    }
}

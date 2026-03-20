package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.ShortlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shortlist")
@RequiredArgsConstructor
@Slf4j
public class ShortlistController {

    private final ShortlistService shortlistService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @PostMapping("/{profileId}")
    public ResponseEntity<Map<String, String>> addToShortlist(@PathVariable Long profileId) {
        log.info("Adding profile {} to shortlist for current user", profileId);
        User user = getCurrentUser();
        shortlistService.addToShortlist(user, profileId);
        return ResponseEntity.ok(Map.of("message", "Profile added to shortlist"));
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Map<String, String>> removeFromShortlist(@PathVariable Long profileId) {
        log.info("Removing profile {} from shortlist for current user", profileId);
        User user = getCurrentUser();
        shortlistService.removeFromShortlist(user, profileId);
        return ResponseEntity.ok(Map.of("message", "Profile removed from shortlist"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProfileDTO>> getMyShortlist() {
        log.info("Fetching shortlist for current user");
        User user = getCurrentUser();
        return ResponseEntity.ok(shortlistService.getMyShortlist(user));
    }

    @GetMapping("/check/{profileId}")
    public ResponseEntity<Map<String, Boolean>> isShortlisted(@PathVariable Long profileId) {
        User user = getCurrentUser();
        boolean isShortlisted = shortlistService.isShortlisted(user, profileId);
        return ResponseEntity.ok(Map.of("isShortlisted", isShortlisted));
    }
}

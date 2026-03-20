package com.punarmilan.controller;

import com.punarmilan.dto.PartnerPreferenceDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.PartnerPreferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
@Slf4j
public class PartnerPreferenceController {

    private final PartnerPreferenceService preferenceService;
    private final UserRepository userRepository;

    // Helper to get user from Security Context
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping("/me")
    public ResponseEntity<PartnerPreferenceDTO> getMyPreferences() {
        log.info("Fetching preferences for current user");
        User user = getCurrentUser();
        return ResponseEntity.ok(preferenceService.getMyPreferences(user));
    }

    @PostMapping
    public ResponseEntity<PartnerPreferenceDTO> updatePreferences(@RequestBody Map<String, Object> updates) {
        log.info("Updating preferences for current user with {} fields", updates.size());
        User user = getCurrentUser();
        return ResponseEntity.ok(preferenceService.updatePreferences(user, updates));
    }
}

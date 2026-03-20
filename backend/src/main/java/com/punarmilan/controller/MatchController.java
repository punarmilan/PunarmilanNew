package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.MatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Slf4j
public class MatchController {

    private final MatchService matchService;
    private final UserRepository userRepository;

    // Helper to get user from Security Context
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping("/new")
    public ResponseEntity<Page<ProfileDTO>> getNewMatches(Pageable pageable) {
        log.info("Request received for new matches");
        User user = getCurrentUser();
        return ResponseEntity.ok(matchService.getNewMatches(user, pageable));
    }

    @GetMapping("/today")
    public ResponseEntity<Page<ProfileDTO>> getTodayMatches(Pageable pageable) {
        log.info("Request received for today's matches");
        User user = getCurrentUser();
        return ResponseEntity.ok(matchService.getTodayMatches(user, pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<ProfileDTO>> getAllMatches(Pageable pageable) {
        log.info("Request received for all matches");
        User user = getCurrentUser();
        return ResponseEntity.ok(matchService.getAllMatches(user, pageable));
    }

    @GetMapping("/near-me")
    public ResponseEntity<Page<ProfileDTO>> getNearMeMatches(Pageable pageable) {
        log.info("Request received for near-me matches");
        User user = getCurrentUser();
        return ResponseEntity.ok(matchService.getNearMeMatches(user, pageable));
    }

    @GetMapping("/recently-viewed")
    public ResponseEntity<Page<ProfileDTO>> getRecentlyViewedProfiles(Pageable pageable) {
        log.info("Request received for recently viewed matches");
        User user = getCurrentUser();
        return ResponseEntity.ok(matchService.getRecentlyViewedProfiles(user, pageable));
    }

    @org.springframework.web.bind.annotation.GetMapping("/recent-visitors")
    public ResponseEntity<Page<ProfileDTO>> getRecentVisitors(Pageable pageable) {
        log.info("Request received for recent visitors");
        User user = getCurrentUser();
        return ResponseEntity.ok(matchService.getRecentVisitors(user, pageable));
    }

    @org.springframework.web.bind.annotation.PostMapping("/view/{profileId}")
    public ResponseEntity<Void> logProfileView(@org.springframework.web.bind.annotation.PathVariable Long profileId) {
        log.info("Request received to log profile view: {}", profileId);
        User user = getCurrentUser();
        matchService.logProfileView(user, profileId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/preference-match/{profileId}")
    public ResponseEntity<com.punarmilan.dto.PreferenceMatchDTO> getPreferenceMatch(@org.springframework.web.bind.annotation.PathVariable Long profileId) {
        log.info("Request received for preference match with profile: {}", profileId);
        User user = getCurrentUser();
        return ResponseEntity.ok(matchService.getPreferenceMatch(user, profileId));
    }
}

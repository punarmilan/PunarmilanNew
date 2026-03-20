package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.MatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@Slf4j
public class SocialController {

    private final MatchService matchService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping("/online-matches")
    public ResponseEntity<Page<ProfileDTO>> getOnlineMatches(Pageable pageable) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(matchService.getOnlineMatches(currentUser, pageable));
    }

    @GetMapping("/online-accepted")
    public ResponseEntity<Page<ProfileDTO>> getOnlineAccepted(Pageable pageable) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(matchService.getOnlineAcceptedMembers(currentUser, pageable));
    }

    @GetMapping("/shortlisted")
    public ResponseEntity<Page<ProfileDTO>> getShortlisted(Pageable pageable) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(matchService.getShortlistedMembers(currentUser, pageable));
    }
}

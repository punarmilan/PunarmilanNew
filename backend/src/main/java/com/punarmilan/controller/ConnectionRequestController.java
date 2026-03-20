package com.punarmilan.controller;

import com.punarmilan.dto.ConnectionRequestDTO;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.RequestStatus;
import com.punarmilan.entity.enums.RequestType;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.ConnectionRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
@Slf4j
public class ConnectionRequestController {

    private final ConnectionRequestService connectionRequestService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @PostMapping("/send/{receiverProfileId}")
    public ResponseEntity<Void> sendRequest(@PathVariable Long receiverProfileId) {
        log.info("Request to send connection to profile {}", receiverProfileId);
        connectionRequestService.sendRequest(getCurrentUser(), receiverProfileId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/photo/send/{receiverProfileId}")
    public ResponseEntity<Void> sendPhotoRequest(@PathVariable Long receiverProfileId) {
        log.info("Request to send photo request to profile {}", receiverProfileId);
        connectionRequestService.sendPhotoRequest(getCurrentUser(), receiverProfileId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/accept/{requestId}")
    public ResponseEntity<Void> acceptRequest(@PathVariable Long requestId) {
        log.info("Request to accept connection {}", requestId);
        connectionRequestService.acceptRequest(getCurrentUser(), requestId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/decline/{requestId}")
    public ResponseEntity<Void> declineRequest(@PathVariable Long requestId) {
        log.info("Request to decline connection {}", requestId);
        connectionRequestService.declineRequest(getCurrentUser(), requestId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/received")
    public ResponseEntity<List<ConnectionRequestDTO>> getReceivedRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestType type) {
        log.info("Request to fetch received connections with status {} and type {}", status, type);
        return ResponseEntity.ok(connectionRequestService.getReceivedRequests(getCurrentUser(), status, type));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ConnectionRequestDTO>> getSentRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestType type) {
        log.info("Request to fetch sent connections with status {} and type {}", status, type);
        return ResponseEntity.ok(connectionRequestService.getSentRequests(getCurrentUser(), status, type));
    }
}

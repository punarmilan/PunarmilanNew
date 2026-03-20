package com.punarmilan.controller;

import com.punarmilan.dto.NotificationDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    /** GET /api/notifications?page=0&size=20 — paginated list */
    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching notifications for current user (page={}, size={})", page, size);
        User user = getCurrentUser();
        return ResponseEntity.ok(notificationService.getNotifications(user, page, size));
    }

    /** GET /api/notifications/unread — unread notifications list */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        log.info("Fetching unread notifications for current user");
        User user = getCurrentUser();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(user));
    }

    /** GET /api/notifications/unread-count */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User user = getCurrentUser();
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /** PATCH /api/notifications/{id}/read — mark single notification as read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        log.info("Marking notification {} as read", id);
        User user = getCurrentUser();
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok().build();
    }

    /** PATCH /api/notifications/mark-all-read — mark all as read */
    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead() {
        log.info("Marking all notifications as read");
        User user = getCurrentUser();
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}

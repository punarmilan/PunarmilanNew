package com.punarmilan.controller;

import com.punarmilan.dto.ReportDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.AdminReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final AdminReportService adminReportService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @PostMapping
    public ResponseEntity<Void> submitReport(@RequestBody ReportDTO reportDTO) {
        log.info("Received report submission from user");
        User reporter = getCurrentUser();
        adminReportService.createReport(reportDTO, reporter.getId());
        return ResponseEntity.ok().build();
    }
}

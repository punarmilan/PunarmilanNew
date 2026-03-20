package com.punarmilan.service.impl;

import com.punarmilan.dto.AdminDashboardStatsDTO;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.repository.ReportRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.repository.UserSubscriptionRepository;
import com.punarmilan.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ReportRepository reportRepository;
    private final UserSubscriptionRepository subscriptionRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsDTO getStats() {
        long totalUsers = userRepository.count();
        long pendingApprovals = profileRepository.countByVerificationStatus("PENDING");
        long pendingPhotoApprovals = profileRepository.countByPhotoVerificationStatus("PENDING");
        long reportedProfiles = reportRepository.countByStatus("PENDING");

        // Gender Distribution
        Map<String, Long> genderDist = new HashMap<>();
        genderDist.put("Male", profileRepository.countByGender("MALE"));
        genderDist.put("Female", profileRepository.countByGender("FEMALE"));

        // User Growth (Last 30 days)
        List<Map<String, Object>> growth = new ArrayList<>();
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        // This is a simplified logic, in production use a custom query for efficiency
        growth.add(Map.of("date", "30 Days Ago", "count", userRepository.countByCreatedAtAfter(thirtyDaysAgo)));
        growth.add(Map.of("date", "Today", "count", totalUsers));

        return AdminDashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .pendingApprovals(pendingApprovals)
                .pendingPhotoApprovals(pendingPhotoApprovals)
                .activeSubscriptions(subscriptionRepository.countByActiveTrue())
                .reportedProfiles(reportedProfiles)
                .totalRevenue(subscriptionRepository.calculateTotalRevenue() != null
                        ? subscriptionRepository.calculateTotalRevenue()
                        : 0.0)
                .genderDistribution(genderDist)
                .userGrowth(growth)
                .build();
    }
}

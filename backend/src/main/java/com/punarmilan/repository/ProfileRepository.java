package com.punarmilan.repository;

import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>,
                org.springframework.data.jpa.repository.JpaSpecificationExecutor<Profile> {
        Optional<Profile> findByUser(User user);

        Optional<Profile> findByUserId(Long userId);

        Optional<Profile> findByProfileId(String profileId);

        List<Profile> findAllByGenderAndProfileVisibilityNotAndCreatedAtBetween(String gender, String visibility,
                        LocalDateTime start, LocalDateTime end);

        Page<Profile> findAllByGenderAndProfileVisibilityNot(String gender, String visibility, Pageable pageable);

        List<Profile> findAllByGenderAndProfileVisibilityNot(String gender, String visibility);

        Page<Profile> findAllByGenderAndCityIgnoreCaseAndProfileVisibilityNot(String gender, String city, String visibility, Pageable pageable);

        List<Profile> findAllByGenderAndCityIgnoreCaseAndProfileVisibilityNot(String gender, String city, String visibility);

        Page<Profile> findAllByGenderAndStateIgnoreCaseAndProfileVisibilityNot(String gender, String state, String visibility, Pageable pageable);

        List<Profile> findAllByGenderAndStateIgnoreCaseAndProfileVisibilityNot(String gender, String state, String visibility);

        List<Profile> findAllByGenderAndCountryAndProfileVisibilityNot(String gender, String country,
                        String visibility);

        List<Profile> findTop5ByGenderAndProfileVisibilityNotOrderByCreatedAtDesc(String gender, String visibility);

        @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM profiles p WHERE p.user_id != :userId AND p.gender = :gender AND (p.profile_visibility != 'HIDDEN' OR p.profile_visibility IS NULL) AND p.id NOT IN (:excludedIds) ORDER BY RAND()", nativeQuery = true)
        List<Profile> findRandomProfilesExcluding(
                        @org.springframework.data.repository.query.Param("userId") Long userId,
                        @org.springframework.data.repository.query.Param("gender") String gender,
                        @org.springframework.data.repository.query.Param("excludedIds") java.util.Collection<Long> excludedIds,
                        org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT p FROM Profile p JOIN p.user u WHERE p.gender = :gender AND (p.profileVisibility != 'HIDDEN' OR p.profileVisibility IS NULL) AND u.lastActive > :threshold AND u.id != :currentUserId")
        List<Profile> findOnlineProfiles(@org.springframework.data.repository.query.Param("gender") String gender,
                        @org.springframework.data.repository.query.Param("threshold") LocalDateTime threshold,
                        @org.springframework.data.repository.query.Param("currentUserId") Long currentUserId);

        long countByVerificationStatus(String status);

        long countByPhotoVerificationStatus(String status);

        long countByGender(String gender);

        @org.springframework.data.jpa.repository.Query("SELECT p FROM Profile p JOIN p.user u WHERE p.gender = :gender "
                        + "AND (p.profileVisibility IS NULL OR p.profileVisibility != 'HIDDEN') "
                        + "AND u.enabled = true "
                        + "ORDER BY p.createdAt DESC")
        List<Profile> findLatestActiveByGender(@org.springframework.data.repository.query.Param("gender") String gender,
                        org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT p FROM Profile p JOIN FETCH p.user u WHERE p.gender = :gender "
                        + "AND (p.profileVisibility IS NULL OR p.profileVisibility != 'HIDDEN') "
                        + "AND u.enabled = true AND u.id NOT IN :excludedIds "
                        + "ORDER BY p.createdAt DESC")
        List<Profile> findCandidateProfiles(
                        @org.springframework.data.repository.query.Param("gender") String gender,
                        @org.springframework.data.repository.query.Param("excludedIds") java.util.Collection<Long> excludedIds,
                        org.springframework.data.domain.Pageable pageable);
}

package com.punarmilan.repository;

import com.punarmilan.entity.PartnerPreference;
import com.punarmilan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartnerPreferenceRepository extends JpaRepository<PartnerPreference, Long> {
    Optional<PartnerPreference> findByUser(User user);

    Optional<PartnerPreference> findByUserId(Long userId);

    java.util.List<PartnerPreference> findAllByUserIdIn(java.util.List<Long> userIds);
}

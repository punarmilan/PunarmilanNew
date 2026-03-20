package com.punarmilan.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.punarmilan.dto.PartnerPreferenceDTO;
import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.dto.SearchCriteriaDTO;
import com.punarmilan.entity.PartnerPreference;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.RequestStatus;
import com.punarmilan.entity.enums.RequestType;
import com.punarmilan.exception.DuplicateResourceException;
import com.punarmilan.repository.ContactViewRepository;
import com.punarmilan.repository.ConnectionRequestRepository;
import com.punarmilan.repository.PartnerPreferenceRepository;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.MinioService;
import com.punarmilan.service.ProfileService;
import com.punarmilan.service.UserActivityService;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;
    private final PartnerPreferenceRepository partnerPreferenceRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final ContactViewRepository contactViewRepository;
    private final UserActivityService userActivityService;

    @Override
    @Transactional(readOnly = true)
    public Page<ProfileDTO> searchProfiles(SearchCriteriaDTO criteria, User viewer, Pageable pageable) {
        Specification<Profile> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Exclude the viewer's own profile from search results
            if (viewer != null) {
                predicates.add(cb.notEqual(root.get("user").get("id"), viewer.getId()));
            }

            if (criteria.getProfileId() != null && !criteria.getProfileId().isEmpty()) {
                predicates.add(cb.equal(root.get("profileId"), criteria.getProfileId()));
                // If searching by ID, we usually don't need other filters,
                // but let's keep them as additive for now.
            }
            if (criteria.getAgeFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("age"), criteria.getAgeFrom()));
            }
            if (criteria.getAgeTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("age"), criteria.getAgeTo()));
            }

            // Handle Gender Filtering
            String targetGender = criteria.getGender();
            if (targetGender == null && viewer != null) {
                // If no gender specified, default to opposite of viewer
                String viewerGender = profileRepository.findByUser(viewer)
                        .map(Profile::getGender)
                        .orElse(null);
                if (viewerGender != null) {
                    targetGender = viewerGender.equalsIgnoreCase("Male") ? "Female" : "Male";
                }
            }

            if (targetGender != null) {
                predicates.add(cb.equal(root.get("gender"), targetGender));
            }

            if (criteria.getReligion() != null && !criteria.getReligion().isEmpty()) {
                predicates.add(root.get("religion").in(criteria.getReligion()));
            }
            if (criteria.getCaste() != null && !criteria.getCaste().isEmpty()) {
                predicates.add(root.get("caste").in(criteria.getCaste()));
            }
            if (criteria.getMaritalStatus() != null && !criteria.getMaritalStatus().isEmpty()) {
                predicates.add(root.get("maritalStatus").in(criteria.getMaritalStatus()));
            }
            if (criteria.getMotherTongue() != null && !criteria.getMotherTongue().isEmpty()) {
                predicates.add(root.get("motherTongue").in(criteria.getMotherTongue()));
            }
            if (criteria.getState() != null && !criteria.getState().isEmpty()) {
                predicates.add(root.get("state").in(criteria.getState()));
            }
            if (criteria.getOccupation() != null && !criteria.getOccupation().isEmpty()) {
                predicates.add(root.get("occupation").in(criteria.getOccupation()));
            }
            if (criteria.getIsPremium() != null) {
                predicates.add(cb.equal(root.get("isPremium"), criteria.getIsPremium()));
            }
            if (criteria.getShowWithPhoto() != null && criteria.getShowWithPhoto()) {
                predicates.add(cb.isNotNull(root.get("profilePhotoUrl")));
            }

            predicates.add(cb.or(
                    cb.notEqual(root.get("profileVisibility"), "HIDDEN"),
                    cb.isNull(root.get("profileVisibility"))));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return profileRepository.findAll(spec, pageable)
                .map(p -> this.mapToDTO(p, viewer));
    }

    @Override
    @Transactional
    @Cacheable(value = "profiles", key = "#user.email")
    public ProfileDTO getMyProfile(User user) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Backfill profileId if missing or fallback value
        if (profile.getProfileId() == null || profile.getProfileId().isEmpty()
                || profile.getProfileId().equals("PM00000000")) {
            log.info("Backfilling missing profileId for user: {}", user.getEmail());
            profile.setProfileId(generateUniqueProfileId());
            profile = profileRepository.save(profile);
        }

        return mapToDTO(profile, user);
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "profiles", key = "#user.email"),
        @CacheEvict(value = "profiles", allEntries = true) // Safer fallback to clear ID-based cache
    })
    public ProfileDTO updateProfile(User user, Map<String, Object> updates) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        updates.forEach((key, value) -> {
            if ("email".equals(key)) {
                String newEmail = (String) value;
                if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                    throw new DuplicateResourceException("Email already in use: " + newEmail);
                }
                user.setEmail(newEmail);
            } else if ("mobileNumber".equals(key)) {
                String newMobile = (String) value;
                if (!newMobile.equals(user.getMobileNumber()) && userRepository.existsByMobileNumber(newMobile)) {
                    throw new DuplicateResourceException("Mobile number already in use: " + newMobile);
                }
                user.setMobileNumber(newMobile);
            } else if ("enabled".equals(key)) {
                user.setEnabled((Boolean) value);
            } else {
                try {
                    Field field = Profile.class.getDeclaredField(key);
                    field.setAccessible(true);
                    field.set(profile, value);
                } catch (Exception e) {
                    log.warn("Could not update field {}: {}", key, e.getMessage());
                }
            }
        });

        if (updates.containsKey("email") || updates.containsKey("mobileNumber") || updates.containsKey("enabled")) {
            userRepository.save(user);
        }

        Profile savedProfile = profileRepository.save(profile);
        return mapToDTO(savedProfile, user);
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "profiles", key = "#user.email"),
        @CacheEvict(value = "profiles", allEntries = true)
    })
    public ProfileDTO uploadPhoto(User user, MultipartFile file, Integer photoIndex) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String photoPath = minioService.uploadFile(file, "profile-" + user.getId());

        switch (photoIndex) {
            case 0 -> profile.setProfilePhotoUrl(photoPath);
            case 1 -> profile.setPhotoUrl2(photoPath);
            case 2 -> profile.setPhotoUrl3(photoPath);
            case 3 -> profile.setPhotoUrl4(photoPath);
            case 4 -> profile.setPhotoUrl5(photoPath);
            case 5 -> profile.setPhotoUrl6(photoPath);
        }

        profile.setPhotoCount(countExistingPhotos(profile));
        profile.setPhotoVerificationStatus("PENDING");
        return mapToDTO(profileRepository.save(profile), user);
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "profiles", key = "#user.email"),
        @CacheEvict(value = "profiles", allEntries = true)
    })
    public ProfileDTO deletePhoto(User user, Integer photoIndex) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return deletePhotoInternal(profile, photoIndex, user);
    }

    @Override
    @Transactional
    public ProfileDTO deletePhotoByProfileId(Long profileId, Integer photoIndex) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return deletePhotoInternal(profile, photoIndex, null);
    }

    private ProfileDTO deletePhotoInternal(Profile profile, Integer photoIndex, User viewer) {
        String photoUrl = null;
        switch (photoIndex) {
            case 0 -> {
                photoUrl = profile.getProfilePhotoUrl();
                profile.setProfilePhotoUrl(null);
            }
            case 1 -> {
                photoUrl = profile.getPhotoUrl2();
                profile.setPhotoUrl2(null);
            }
            case 2 -> {
                photoUrl = profile.getPhotoUrl3();
                profile.setPhotoUrl3(null);
            }
            case 3 -> {
                photoUrl = profile.getPhotoUrl4();
                profile.setPhotoUrl4(null);
            }
            case 4 -> {
                photoUrl = profile.getPhotoUrl5();
                profile.setPhotoUrl5(null);
            }
            case 5 -> {
                photoUrl = profile.getPhotoUrl6();
                profile.setPhotoUrl6(null);
            }
        }

        if (photoUrl != null) {
            minioService.deleteFile(photoUrl);
            profile.setPhotoCount(countExistingPhotos(profile));
            return mapToDTO(profileRepository.save(profile), viewer);
        }
        return mapToDTO(profile, viewer);
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "profiles", key = "#user.email"),
        @CacheEvict(value = "profiles", allEntries = true)
    })
    public ProfileDTO uploadIdProof(User user, MultipartFile file, String idProofType, String idProofNumber) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Upload to MinIO
        String proofPath = minioService.uploadFile(file, "id-proof-" + user.getId());

        // Update profile fields
        profile.setIdProofUrl(proofPath);
        profile.setIdProofType(idProofType);
        profile.setIdProofNumber(idProofNumber);
        profile.setVerificationStatus("PENDING");
        profile.setVerifiedAt(null); // Reset if it was previously verified
        profile.setVerifiedBy(null);

        return mapToDTO(profileRepository.save(profile), user);
    }

    private Integer countExistingPhotos(Profile profile) {
        int count = 0;
        if (profile.getProfilePhotoUrl() != null)
            count++;
        if (profile.getPhotoUrl2() != null)
            count++;
        if (profile.getPhotoUrl3() != null)
            count++;
        if (profile.getPhotoUrl4() != null)
            count++;
        if (profile.getPhotoUrl5() != null)
            count++;
        if (profile.getPhotoUrl6() != null)
            count++;
        return count;
    }

    @Override
    @Transactional
    public void createDefaultProfile(User user, String firstName, String lastName, String profileCreatedBy,
            String gender) {
        String uniqueProfileId = generateUniqueProfileId();
        Profile profile = Profile.builder()
                .user(user)
                .profileId(uniqueProfileId)
                .fullName(firstName + " " + lastName)
                .profileCreatedBy(profileCreatedBy)
                .gender(gender)
                .photoCount(0)
                .isPremium(false)
                .profileVisibility("Public")
                .profilePhotoVisibility("ALL_MEMBERS")
                .build();
        profileRepository.save(profile);
    }

    private String generateUniqueProfileId() {
        java.util.Random random = new java.util.Random();
        String profileId;
        boolean exists;
        do {
            // Generate PM + 8 random digits
            long number = 10000000L + random.nextInt(90000000);
            profileId = "PM" + number;
            exists = profileRepository.findByProfileId(profileId).isPresent();
        } while (exists);
        return profileId;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "profiles", key = "#userId")
    public ProfileDTO getProfileByUserId(Long userId, User viewer) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));
        return mapToDTO(profile, viewer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfileDTO> mapToDTOs(List<Profile> profiles, User viewer) {
        if (profiles == null || profiles.isEmpty()) {
            return new ArrayList<>();
        }

        // 1. Pre-fetch Contact Views for all profiles at once
        java.util.Set<Long> viewedProfileIds = new java.util.HashSet<>();
        if (viewer != null) {
            List<Long> profileIds = profiles.stream().map(Profile::getId).collect(Collectors.toList());
            viewedProfileIds.addAll(contactViewRepository.findViewedProfileIdsByViewerAndProfileIds(viewer.getId(), profileIds));
        }

        // 2. Pre-fetch Partner Preferences for all profile authors at once
        List<Long> userIds = profiles.stream()
                .filter(p -> p.getUser() != null)
                .map(p -> p.getUser().getId())
                .collect(Collectors.toList());
        Map<Long, com.punarmilan.entity.PartnerPreference> prefMap = partnerPreferenceRepository.findAllByUserIdIn(userIds)
                .stream()
                .collect(Collectors.toMap(p -> p.getUser().getId(), p -> p, (a, b) -> a));

        // 3. Map everything using pre-fetched data
        return profiles.stream().map(profile -> {
            ProfileDTO dto = mapToDTO(profile, viewer);
            
            // Override with pre-fetched data to avoid sub-queries in mapToDTO
            if (viewer != null) {
                dto.setIsContactViewed(viewedProfileIds.contains(profile.getId()));
            }
            
            if (profile.getUser() != null) {
                com.punarmilan.entity.PartnerPreference pref = prefMap.get(profile.getUser().getId());
                if (pref != null) {
                    dto.setPartnerPreference(mapToPartnerPreferenceDTO(pref));
                }
            }
            
            return dto;
        }).collect(Collectors.toList());
    }

    private boolean isUserPremium(User user) {
        if (user == null)
            return false;
        return Boolean.TRUE.equals(user.getIsPremium()) &&
                user.getPremiumExpiry() != null &&
                user.getPremiumExpiry().isAfter(LocalDateTime.now());
    }

    @Override
    public ProfileDTO mapToDTO(Profile profile, User viewer) {
        // Admin (viewer is null in this context) can always see photos
        boolean canSeePhotos = (viewer == null) || checkPhotoVisibility(profile, viewer);

        ProfileDTO dto = ProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .enabled(profile.getUser() != null ? profile.getUser().getEnabled() : null)
                .email(profile.getUser() != null ? profile.getUser().getEmail() : null)
                .mobileNumber(profile.getUser() != null ? profile.getUser().getMobileNumber() : null)
                .profileId(profile.getProfileId())
                .fullName(profile.getFullName())
                .age(profile.getAge())
                .gender(profile.getGender())
                .height(profile.getHeight())
                .weight(profile.getWeight())
                .maritalStatus(profile.getMaritalStatus())
                .motherTongue(profile.getMotherTongue())
                .religion(profile.getReligion())
                .caste(profile.getCaste())
                .subCaste(profile.getSubCaste())
                .gotra(profile.getGotra())
                .manglikStatus(profile.getManglikStatus())
                .city(profile.getCity())
                .state(profile.getState())
                .country(profile.getCountry())
                .address(profile.getAddress())
                .zipCode(profile.getZipCode())
                .occupation(profile.getOccupation())
                .company(profile.getCompany())
                .annualIncome(profile.getAnnualIncome())
                .dateOfBirth(profile.getDateOfBirth())
                .timeOfBirth(profile.getTimeOfBirth())
                .placeOfBirth(profile.getPlaceOfBirth())
                .nakshatra(profile.getNakshatra())
                .rashi(profile.getRashi())
                .fatherStatus(profile.getFatherStatus())
                .motherStatus(profile.getMotherStatus())
                .brothersCount(profile.getBrothersCount())
                .sistersCount(profile.getSistersCount())
                .familyFinancialStatus(profile.getFamilyFinancialStatus())
                .familyLocation(profile.getFamilyLocation())
                .educationLevel(profile.getEducationLevel())
                .educationField(profile.getEducationField())
                .college(profile.getCollege())
                .workingCity(profile.getWorkingCity())
                .workingWith(profile.getWorkingWith())
                .connectMessage(profile.getConnectMessage())
                .acceptMessage(profile.getAcceptMessage())
                .notificationSettings(profile.getNotificationSettings())
                .profileCreatedBy(profile.getProfileCreatedBy())
                .verificationStatus(profile.getVerificationStatus())
                .idProofType(profile.getIdProofType())
                .idProofNumber(profile.getIdProofNumber())
                .contactDisplayStatus(profile.getContactDisplayStatus())
                .profileVisibility(profile.getProfileVisibility())
                .profilePhotoVisibility(profile.getProfilePhotoVisibility())
                .albumPhotoVisibility(profile.getAlbumPhotoVisibility())
                .astroVisibility(profile.getAstroVisibility())
                .displayNameVisibility(profile.getDisplayNameVisibility())
                .emailVisibility(profile.getEmailVisibility())
                .dobVisibility(profile.getDobVisibility())
                .annualIncomeVisibility(profile.getAnnualIncomeVisibility())
                .shortlistVisibility(profile.getShortlistVisibility())
                .doNotDisturb(profile.getDoNotDisturb())
                .aboutMe(profile.getAboutMe())
                .hobbies(profile.getHobbies())
                .diet(profile.getDiet())
                .smokingHabit(profile.getSmokingHabit())
                .drinkingHabit(profile.getDrinkingHabit())
                .bloodGroup(profile.getBloodGroup())
                .healthInformation(profile.getHealthInformation())
                .disability(profile.getDisability())
                .grewUpIn(profile.getGrewUpIn())
                .residencyStatus(profile.getResidencyStatus())
                .photoCount(profile.getPhotoCount())
                .profilePhotoUrl(canSeePhotos ? processPhotoUrl(profile, profile.getProfilePhotoUrl(), 0) : null)
                .photoUrl2(canSeePhotos ? processPhotoUrl(profile, profile.getPhotoUrl2(), 1) : null)
                .photoUrl3(canSeePhotos ? processPhotoUrl(profile, profile.getPhotoUrl3(), 2) : null)
                .photoUrl4(canSeePhotos ? processPhotoUrl(profile, profile.getPhotoUrl4(), 3) : null)
                .photoUrl5(canSeePhotos ? processPhotoUrl(profile, profile.getPhotoUrl5(), 4) : null)
                .photoUrl6(canSeePhotos ? processPhotoUrl(profile, profile.getPhotoUrl6(), 5) : null)
                .isPremium(profile.getIsPremium())
                .photoVerificationStatus(profile.getPhotoVerificationStatus())
                .mobileVerified(profile.getUser() != null ? profile.getUser().getMobileVerified() : false)
                .isOnline(safeIsUserOnline(profile.getUser()))
                .lastActive(safeGetLastActive(profile.getUser()))
                .idProofUrl((viewer == null || (viewer != null && profile.getUser() != null
                        && viewer.getId().equals(profile.getUser().getId())))
                                ? processPhotoUrl(profile, profile.getIdProofUrl(), -1)
                                : null)
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .premiumVisible(isUserPremium(viewer) || !isUserPremium(profile.getUser()))
                .isContactViewed(viewer != null && contactViewRepository.existsByViewerAndViewedProfile(viewer, profile))
                .build();

        if (profile.getUser() != null) {
            partnerPreferenceRepository.findByUserId(profile.getUser().getId())
                    .ifPresent(pref -> dto.setPartnerPreference(mapToPartnerPreferenceDTO(pref)));
        }

        return dto;
    }

    private boolean safeIsUserOnline(User user) {
        if (user == null || user.getEmail() == null) return false;
        try {
            return userActivityService.isUserOnline(user.getEmail());
        } catch (Exception e) {
            log.warn("Error checking online status for user {}: {}", user.getEmail(), e.getMessage());
            return false;
        }
    }

    private LocalDateTime safeGetLastActive(User user) {
        if (user == null || user.getEmail() == null) return null;
        try {
            return userActivityService.getLastActive(user.getEmail());
        } catch (Exception e) {
            log.warn("Error getting last active status for user {}: {}", user.getEmail(), e.getMessage());
            return user.getLastActive(); // Fallback to DB value stored in proxy if possible
        }
    }

    private boolean checkPhotoVisibility(Profile profile, User viewer) {
        if (viewer != null && profile.getUser() != null && viewer.getId().equals(profile.getUser().getId())) {
            return true; // Owner can always see their own photos
        }

        String visibility = profile.getProfilePhotoVisibility();
        if (visibility == null || visibility.equals("ALL_MEMBERS")) {
            return true;
        }

        if (visibility.equals("MEMBERS_LIKED_PREMIUM")) {
            if (viewer == null)
                return false;

            // Check if viewer is a Premium member via their Profile
            boolean viewerIsPremium = profileRepository.findByUserId(viewer.getId())
                    .map(p -> Boolean.TRUE.equals(p.getIsPremium()))
                    .orElse(false);

            if (viewerIsPremium) {
                return true;
            }

            // Check if there's an accepted connection from either side
            return connectionRequestRepository.existsBySenderAndReceiverAndStatusAndRequestType(
                    profile.getUser(), viewer, RequestStatus.ACCEPTED, RequestType.CONNECTION) ||
                    connectionRequestRepository.existsBySenderAndReceiverAndStatusAndRequestType(
                            viewer, profile.getUser(), RequestStatus.ACCEPTED, RequestType.CONNECTION);
        }

        return false;
    }

    private String processPhotoUrl(Profile profile, String storedValue, int index) {
        if (storedValue == null || storedValue.isEmpty()) {
            return null;
        }

        String actualPath = storedValue;
        if (storedValue.contains("/punarmilan-photos/")) {
            try {
                java.net.URI uri = new java.net.URI(storedValue);
                String path = uri.getPath();
                actualPath = path.substring(path.indexOf("/punarmilan-photos/") + "/punarmilan-photos/".length());
                if (actualPath.contains("?")) {
                    actualPath = actualPath.substring(0, actualPath.indexOf("?"));
                }
            } catch (Exception e) {
                log.warn("Failed to parse legacy URL: {}", storedValue);
            }
        }

        return minioService.getPresignedUrl(actualPath);
    }

    private PartnerPreferenceDTO mapToPartnerPreferenceDTO(PartnerPreference pref) {
        return PartnerPreferenceDTO.builder()
                .id(pref.getId())
                .minAge(pref.getMinAge())
                .maxAge(pref.getMaxAge())
                .preferredReligion(pref.getPreferredReligion())
                .preferredCaste(pref.getPreferredCaste())
                .build();
    }

}

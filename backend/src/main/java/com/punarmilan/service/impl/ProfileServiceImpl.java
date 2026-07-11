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
            boolean isIdSearch = criteria.getProfileId() != null && !criteria.getProfileId().trim().isEmpty();

            if (isIdSearch) {
                // For ID search, we do exact (ignoring case) match on profileId or database ID
                String idToSearch = criteria.getProfileId().trim();
                Predicate idMatch = cb.equal(cb.lower(root.get("profileId")), idToSearch.toLowerCase());
                
                // Also allow searching by the numeric database ID if it looks like a number
                if (idToSearch.matches("\\d+")) {
                    idMatch = cb.or(idMatch, cb.equal(root.get("id"), Long.parseLong(idToSearch)));
                }
                
                predicates.add(idMatch);
            } else {
                // Exclude the viewer's own profile from standard search results
                if (viewer != null) {
                    predicates.add(cb.notEqual(root.get("user").get("id"), viewer.getId()));
                }

                // Standard search filters
                if (criteria.getAgeFrom() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("age"), criteria.getAgeFrom()));
                }
                if (criteria.getAgeTo() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("age"), criteria.getAgeTo()));
                }

                // Handle Gender Filtering
                String targetGender = criteria.getGender();
                if (targetGender == null && viewer != null) {
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
                    List<String> values = filterOpenToAll(criteria.getReligion());
                    if (!values.isEmpty()) predicates.add(root.get("religion").in(values));
                }
                if (criteria.getCaste() != null && !criteria.getCaste().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getCaste());
                    if (!values.isEmpty()) predicates.add(root.get("caste").in(values));
                }
                if (criteria.getMaritalStatus() != null && !criteria.getMaritalStatus().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getMaritalStatus());
                    if (!values.isEmpty()) predicates.add(root.get("maritalStatus").in(values));
                }
                if (criteria.getMotherTongue() != null && !criteria.getMotherTongue().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getMotherTongue());
                    if (!values.isEmpty()) predicates.add(root.get("motherTongue").in(values));
                }
                if (criteria.getCountry() != null && !criteria.getCountry().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getCountry());
                    if (!values.isEmpty()) predicates.add(root.get("country").in(values));
                }
                if (criteria.getState() != null && !criteria.getState().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getState());
                    if (!values.isEmpty()) predicates.add(root.get("state").in(values));
                }
                if (criteria.getOccupation() != null && !criteria.getOccupation().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getOccupation());
                    if (!values.isEmpty()) predicates.add(root.get("occupation").in(values));
                }
                if (criteria.getResidencyStatus() != null && !criteria.getResidencyStatus().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getResidencyStatus());
                    if (!values.isEmpty()) predicates.add(root.get("residencyStatus").in(values));
                }
                if (criteria.getGrewUpIn() != null && !criteria.getGrewUpIn().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getGrewUpIn());
                    if (!values.isEmpty()) predicates.add(root.get("grewUpIn").in(values));
                }
                if (criteria.getEducationLevel() != null && !criteria.getEducationLevel().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getEducationLevel());
                    if (!values.isEmpty()) predicates.add(root.get("educationLevel").in(values));
                }
                if (criteria.getEducationField() != null && !criteria.getEducationField().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getEducationField());
                    if (!values.isEmpty()) predicates.add(root.get("educationField").in(values));
                }
                if (criteria.getWorkingWith() != null && !criteria.getWorkingWith().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getWorkingWith());
                    if (!values.isEmpty()) predicates.add(root.get("workingWith").in(values));
                }
                if (criteria.getDiet() != null && !criteria.getDiet().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getDiet());
                    if (!values.isEmpty()) predicates.add(root.get("diet").in(values));
                }
                if (criteria.getProfileCreatedBy() != null && !criteria.getProfileCreatedBy().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getProfileCreatedBy());
                    if (!values.isEmpty()) predicates.add(root.get("profileCreatedBy").in(values));
                }
                if (criteria.getMinIncome() != null && !criteria.getMinIncome().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("annualIncome")), "%" + criteria.getMinIncome().toLowerCase() + "%"));
                }
                if (criteria.getShowProtectedPhoto() != null && criteria.getShowProtectedPhoto()) {
                    predicates.add(cb.equal(root.get("profilePhotoVisibility"), "PROTECTED"));
                }

                // New Premium Filtering Fields
                if (criteria.getKeyword() != null && !criteria.getKeyword().trim().isEmpty()) {
                    String kw = "%" + criteria.getKeyword().trim().toLowerCase() + "%";
                    predicates.add(cb.or(
                        cb.like(cb.lower(root.get("fullName")), kw),
                        cb.like(cb.lower(root.get("profileId")), kw),
                        cb.like(cb.lower(root.get("city")), kw),
                        cb.like(cb.lower(root.get("occupation")), kw)
                    ));
                }
                if (criteria.getSubCaste() != null && !criteria.getSubCaste().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getSubCaste());
                    if (!values.isEmpty()) predicates.add(root.get("subCaste").in(values));
                }
                if (criteria.getCity() != null && !criteria.getCity().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getCity());
                    if (!values.isEmpty()) predicates.add(root.get("city").in(values));
                }
                if (criteria.getWorkingCity() != null && !criteria.getWorkingCity().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getWorkingCity());
                    if (!values.isEmpty()) predicates.add(root.get("workingCity").in(values));
                }
                if (criteria.getCompany() != null && !criteria.getCompany().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getCompany());
                    if (!values.isEmpty()) predicates.add(root.get("company").in(values));
                }
                if (criteria.getBloodGroup() != null && !criteria.getBloodGroup().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getBloodGroup());
                    if (!values.isEmpty()) predicates.add(root.get("bloodGroup").in(values));
                }
                if (criteria.getSmokingHabit() != null && !criteria.getSmokingHabit().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getSmokingHabit());
                    if (!values.isEmpty()) predicates.add(root.get("smokingHabit").in(values));
                }
                if (criteria.getDrinkingHabit() != null && !criteria.getDrinkingHabit().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getDrinkingHabit());
                    if (!values.isEmpty()) predicates.add(root.get("drinkingHabit").in(values));
                }
                if (criteria.getFamilyFinancialStatus() != null && !criteria.getFamilyFinancialStatus().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getFamilyFinancialStatus());
                    if (!values.isEmpty()) predicates.add(root.get("familyFinancialStatus").in(values));
                }
                if (criteria.getRashi() != null && !criteria.getRashi().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getRashi());
                    if (!values.isEmpty()) predicates.add(root.get("rashi").in(values));
                }
                if (criteria.getNakshatra() != null && !criteria.getNakshatra().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getNakshatra());
                    if (!values.isEmpty()) predicates.add(root.get("nakshatra").in(values));
                }
                if (criteria.getGotra() != null && !criteria.getGotra().isEmpty()) {
                    List<String> values = filterOpenToAll(criteria.getGotra());
                    if (!values.isEmpty()) predicates.add(root.get("gotra").in(values));
                }
                if (criteria.getWeight() != null && !criteria.getWeight().trim().isEmpty()) {
                    predicates.add(cb.equal(root.get("weight"), criteria.getWeight().trim()));
                }
                if (criteria.getDisability() != null && !criteria.getDisability().trim().isEmpty()) {
                    predicates.add(cb.equal(root.get("disability"), criteria.getDisability().trim()));
                }
                if (criteria.getFatherStatus() != null && !criteria.getFatherStatus().trim().isEmpty()) {
                    predicates.add(cb.equal(root.get("fatherStatus"), criteria.getFatherStatus().trim()));
                }
                if (criteria.getMotherStatus() != null && !criteria.getMotherStatus().trim().isEmpty()) {
                    predicates.add(cb.equal(root.get("motherStatus"), criteria.getMotherStatus().trim()));
                }
                if (criteria.getManglikStatus() != null && !criteria.getManglikStatus().trim().isEmpty()) {
                    predicates.add(cb.equal(root.get("manglikStatus"), criteria.getManglikStatus().trim()));
                }
                if (criteria.getBrothersCount() != null) {
                    predicates.add(cb.equal(root.get("brothersCount"), criteria.getBrothersCount()));
                }
                if (criteria.getSistersCount() != null) {
                    predicates.add(cb.equal(root.get("sistersCount"), criteria.getSistersCount()));
                }

                // Status Toggles
                if (criteria.getPremium() != null && criteria.getPremium()) {
                    predicates.add(cb.equal(root.get("isPremium"), true));
                } else if (criteria.getIsPremium() != null) {
                    predicates.add(cb.equal(root.get("isPremium"), criteria.getIsPremium()));
                }
                if (criteria.getPhotoAvailable() != null && criteria.getPhotoAvailable()) {
                    predicates.add(cb.isNotNull(root.get("profilePhotoUrl")));
                } else if (criteria.getShowWithPhoto() != null && criteria.getShowWithPhoto()) {
                    predicates.add(cb.isNotNull(root.get("profilePhotoUrl")));
                }
                if (criteria.getVerified() != null && criteria.getVerified()) {
                    predicates.add(cb.equal(root.get("verificationStatus"), "VERIFIED"));
                }
                if (criteria.getProfileComplete() != null && criteria.getProfileComplete()) {
                    predicates.add(cb.equal(root.get("profileComplete"), true));
                }
                if (criteria.getOnlineNow() != null && criteria.getOnlineNow()) {
                    java.time.LocalDateTime tenMinsAgo = java.time.LocalDateTime.now().minusMinutes(10);
                    predicates.add(cb.greaterThan(root.get("user").get("lastActive"), tenMinsAgo));
                }
            }

            // Always enforce visibility unless admin (viewer can be null for admin search)
            predicates.add(cb.or(
                    cb.notEqual(root.get("profileVisibility"), "HIDDEN"),
                    cb.isNull(root.get("profileVisibility"))));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Handle Sorting dynamically
        Pageable finalPageable = pageable;
        if (criteria.getSort() != null && !criteria.getSort().isEmpty()) {
            org.springframework.data.domain.Sort sortObj = pageable.getSort();
            switch (criteria.getSort()) {
                case "Recently Joined":
                    sortObj = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt");
                    break;
                case "Youngest First":
                    sortObj = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "age");
                    break;
                case "Oldest First":
                    sortObj = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "age");
                    break;
                // Add more custom sorting here if needed
            }
            finalPageable = org.springframework.data.domain.PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortObj);
        }

        return profileRepository.findAll(spec, finalPageable)
                .map(p -> this.mapToDTO(p, viewer));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, List<String>> getFilterOptions() {
        Map<String, List<String>> filters = new java.util.HashMap<>();
        
        filters.put("religion", profileRepository.findDistinctReligion());
        filters.put("caste", profileRepository.findDistinctCaste());
        filters.put("subCaste", profileRepository.findDistinctSubCaste());
        filters.put("state", profileRepository.findDistinctState());
        filters.put("city", profileRepository.findDistinctCity());
        filters.put("country", profileRepository.findDistinctCountry());
        filters.put("educationLevel", profileRepository.findDistinctEducationLevel());
        filters.put("educationField", profileRepository.findDistinctEducationField());
        filters.put("occupation", profileRepository.findDistinctOccupation());
        filters.put("company", profileRepository.findDistinctCompany());
        filters.put("motherTongue", profileRepository.findDistinctMotherTongue());
        filters.put("maritalStatus", profileRepository.findDistinctMaritalStatus());
        filters.put("workingWith", profileRepository.findDistinctWorkingWith());
        filters.put("annualIncome", profileRepository.findDistinctAnnualIncome());
        filters.put("diet", profileRepository.findDistinctDiet());
        filters.put("bloodGroup", profileRepository.findDistinctBloodGroup());
        filters.put("rashi", profileRepository.findDistinctRashi());
        filters.put("gotra", profileRepository.findDistinctGotra());
        filters.put("nakshatra", profileRepository.findDistinctNakshatra());
        filters.put("manglikStatus", profileRepository.findDistinctManglikStatus());
        filters.put("familyFinancialStatus", profileRepository.findDistinctFamilyFinancialStatus());
        filters.put("fatherStatus", profileRepository.findDistinctFatherStatus());
        filters.put("motherStatus", profileRepository.findDistinctMotherStatus());
        filters.put("drinkingHabit", profileRepository.findDistinctDrinkingHabit());
        filters.put("smokingHabit", profileRepository.findDistinctSmokingHabit());
        filters.put("disability", profileRepository.findDistinctDisability());
        filters.put("verificationStatus", profileRepository.findDistinctVerificationStatus());

        return filters;
    }

    @Override
    @Transactional
    @Cacheable(value = "profiles", key = "#user.email")
    public ProfileDTO getMyProfile(User user) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));

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
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));

        updates.forEach((key, value) -> {
            if ("email".equals(key)) {
                String newEmail = (String) value;
                if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                    throw new DuplicateResourceException("Email already in use: " + newEmail);
                }
                user.setEmail(newEmail);
            } else if ("mobileNumber".equals(key)) {
                String newMobile = (String) value;
                if (newMobile == null || !newMobile.matches("^[6-9][0-9]{9}$")) {
                    throw new IllegalArgumentException("Mobile number must be 10 digits and start with 6, 7, 8, or 9");
                }
                if (!newMobile.equals(user.getMobileNumber()) && userRepository.existsByMobileNumber(newMobile)) {
                    throw new DuplicateResourceException("Mobile number already in use: " + newMobile);
                }
                user.setMobileNumber(newMobile);
            } else if ("fullName".equals(key)) {
                String name = (String) value;
                if (name != null && !name.matches("^[a-zA-Z\\s]*$")) {
                    throw new IllegalArgumentException("Full name should only contain alphabets");
                }
                profile.setFullName(name);
            } else if ("religion".equals(key)) {
                String rel = (String) value;
                if (rel != null && !rel.matches("^[a-zA-Z\\s]*$")) {
                    throw new IllegalArgumentException("Religion should only contain alphabets");
                }
                profile.setReligion(rel);
            } else if ("caste".equals(key)) {
                String c = (String) value;
                if (c != null && !c.matches("^[a-zA-Z\\s]*$")) {
                    throw new IllegalArgumentException("Community should only contain alphabets");
                }
                profile.setCaste(c);
            } else if ("height".equals(key)) {
                String h = String.valueOf(value);
                // Allow numeric values or standard height strings for compatibility
                if (h != null && !h.matches("^[0-9]*$") && !h.matches(".*\\d+.*")) {
                    throw new IllegalArgumentException("Height should be numeric or contain numbers");
                }
                profile.setHeight(h);
            } else if ("enabled".equals(key)) {
                user.setEnabled((Boolean) value);
            } else if ("idProofType".equals(key)) {
                String type = (String) value;
                List<String> validTypes = List.of("PAN Card", "Aadhar Card", "Driving License", "Voter ID", "Passport");
                if (type != null && !validTypes.contains(type)) {
                    throw new IllegalArgumentException("Invalid ID proof type. Must be one of: " + validTypes);
                }
                profile.setIdProofType(type);
            } else if ("idProofNumber".equals(key)) {
                String idNum = (String) value;
                String idProofType = (String) updates.getOrDefault("idProofType", profile.getIdProofType());
                if (idNum != null && idProofType != null) {
                    idNum = idNum.trim().toUpperCase();
                    switch (idProofType) {
                        case "PAN Card" -> {
                            if (!idNum.matches("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")) {
                                throw new IllegalArgumentException("Invalid PAN format. Example: ABCDE1234F");
                            }
                        }
                        case "Aadhar Card" -> {
                            if (!idNum.matches("^[2-9]{1}[0-9]{11}$")) {
                                throw new IllegalArgumentException("Invalid Aadhaar format. Must be 12 digits and cannot start with 0 or 1");
                            }
                        }
                        case "Driving License" -> {
                            if (!idNum.matches("^[A-Z]{2}[0-9]{13}$") && !idNum.matches("^[A-Z]{2}[0-9]{2}[0-9]{11}$")) {
                                throw new IllegalArgumentException("Invalid Driving License format. Must be 15 characters");
                            }
                        }
                        case "Voter ID" -> {
                            if (!idNum.matches("^[A-Z]{3}[0-9]{7}$")) {
                                throw new IllegalArgumentException("Invalid Voter ID format. Example: ABC1234567");
                            }
                        }
                        case "Passport" -> {
                            if (!idNum.matches("^[A-Z]{1}[0-9]{7}$")) {
                                throw new IllegalArgumentException("Invalid Passport format. Example: A1234567");
                            }
                        }
                    }
                    profile.setIdProofNumber(idNum);
                } else {
                   profile.setIdProofNumber(idNum);
                }
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
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));

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
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));
        return deletePhotoInternal(profile, photoIndex, user);
    }

    @Override
    @Transactional
    public ProfileDTO deletePhotoByProfileId(Long profileId, Integer photoIndex) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));
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
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));

        // Validation for ID Proof Type
        List<String> validTypes = List.of("PAN Card", "Aadhar Card", "Driving License", "Voter ID", "Passport");
        if (idProofType != null && !validTypes.contains(idProofType)) {
            throw new IllegalArgumentException("Invalid ID proof type. Must be one of: " + validTypes);
        }

        // Validation for Religion if provided (sometimes updated with ID proof)
        if (profile.getReligion() != null && !profile.getReligion().matches("^[a-zA-Z\\s]*$")) {
            throw new IllegalArgumentException("Religion should only contain alphabets");
        }

        // Validation for ID Proof Number
        if (idProofNumber != null && idProofType != null) {
            String idNum = idProofNumber.trim().toUpperCase();
            switch (idProofType) {
                case "PAN Card" -> {
                    if (!idNum.matches("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")) {
                        throw new IllegalArgumentException("Invalid PAN format. Example: ABCDE1234F");
                    }
                }
                case "Aadhar Card" -> {
                    if (!idNum.matches("^[2-9]{1}[0-9]{11}$")) {
                        throw new IllegalArgumentException("Invalid Aadhaar format. Must be 12 digits and cannot start with 0 or 1");
                    }
                }
                case "Driving License" -> {
                    if (!idNum.matches("^[A-Z]{2}[0-9]{13}$") && !idNum.matches("^[A-Z]{2}[0-9]{2}[0-9]{11}$")) {
                        throw new IllegalArgumentException("Invalid Driving License format. Must be 15 characters");
                    }
                }
                case "Voter ID" -> {
                    if (!idNum.matches("^[A-Z]{3}[0-9]{7}$")) {
                        throw new IllegalArgumentException("Invalid Voter ID format. Example: ABC1234567");
                    }
                }
                case "Passport" -> {
                    if (!idNum.matches("^[A-Z]{1}[0-9]{7}$")) {
                        throw new IllegalArgumentException("Invalid Passport format. Example: A1234567");
                    }
                }
            }
            // Update the number with formatted one
            idProofNumber = idNum;
        }

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
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found for user: " + userId));
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
    private List<String> filterOpenToAll(List<String> list) {
        if (list == null) return new java.util.ArrayList<>();
        return list.stream()
                .filter(s -> s != null && !"Open to All".equalsIgnoreCase(s.trim()))
                .collect(Collectors.toList());
    }
}

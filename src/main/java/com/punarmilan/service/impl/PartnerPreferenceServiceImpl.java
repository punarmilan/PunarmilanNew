package com.punarmilan.service.impl;

import com.punarmilan.dto.PartnerPreferenceDTO;
import com.punarmilan.entity.PartnerPreference;
import com.punarmilan.entity.User;
import com.punarmilan.repository.PartnerPreferenceRepository;
import com.punarmilan.service.PartnerPreferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PartnerPreferenceServiceImpl implements PartnerPreferenceService {

    private final PartnerPreferenceRepository partnerPreferenceRepository;

    @Override
    @Transactional
    public PartnerPreferenceDTO getMyPreferences(User user) {
        PartnerPreference preferences = partnerPreferenceRepository.findByUser(user)
                .orElseGet(() -> createDefaultPreferences(user));
        return mapToDTO(preferences);
    }

    @Override
    @Transactional
    public PartnerPreferenceDTO updatePreferences(User user, Map<String, Object> updates) {
        PartnerPreference preferences = partnerPreferenceRepository.findByUser(user)
                .orElseGet(() -> createDefaultPreferences(user));

        updates.forEach((key, value) -> {
            try {
                Field field = PartnerPreference.class.getDeclaredField(key);
                field.setAccessible(true);

                if (value == null) {
                    field.set(preferences, null);
                    return;
                }

                Class<?> fieldType = field.getType();

                if (fieldType.equals(String.class)) {
                    field.set(preferences, String.valueOf(value));
                } else if ((fieldType.equals(Integer.class) || fieldType.equals(int.class))) {
                    if (value instanceof String) {
                        field.set(preferences, Integer.parseInt((String) value));
                    } else if (value instanceof Number) {
                        field.set(preferences, ((Number) value).intValue());
                    }
                } else if ((fieldType.equals(Boolean.class) || fieldType.equals(boolean.class))) {
                    if (value instanceof String) {
                        field.set(preferences, Boolean.parseBoolean((String) value));
                    } else {
                        field.set(preferences, value);
                    }
                } else {
                    field.set(preferences, value);
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                log.warn("Field {} not found or could not be updated in PartnerPreference entity", key);
            } catch (Exception e) {
                log.error("Error setting field {}: {}", key, e.getMessage());
            }
        });

        PartnerPreference savedPreferences = partnerPreferenceRepository.save(preferences);
        return mapToDTO(savedPreferences);
    }

    private PartnerPreference createDefaultPreferences(User user) {
        PartnerPreference preferences = PartnerPreference.builder()
                .user(user)
                .minAge(18)
                .maxAge(35)
                .minHeight("5ft")
                .maxHeight("6ft")
                .showVerifiedOnly(true)
                .enableAutoMatch(true)
                .matchScoreThreshold(0)
                .build();
        return partnerPreferenceRepository.save(preferences);
    }

    private PartnerPreferenceDTO mapToDTO(PartnerPreference p) {
        return PartnerPreferenceDTO.builder()
                .id(p.getId())
                .minAge(p.getMinAge())
                .maxAge(p.getMaxAge())
                .minHeight(p.getMinHeight())
                .maxHeight(p.getMaxHeight())
                .preferredReligion(p.getPreferredReligion())
                .preferredCaste(p.getPreferredCaste())
                .preferredSubCaste(p.getPreferredSubCaste())
                .preferredMotherTongue(p.getPreferredMotherTongue())
                .minEducationLevel(p.getMinEducationLevel())
                .preferredEducationField(p.getPreferredEducationField())
                .preferredCountry(p.getPreferredCountry())
                .preferredState(p.getPreferredState())
                .preferredCity(p.getPreferredCity())
                .occupation(p.getOccupation())
                .workingWith(p.getWorkingWith())
                .professionArea(p.getProfessionArea())
                .minAnnualIncome(p.getMinAnnualIncome())
                .maritalStatus(p.getMaritalStatus())
                .preferredDiet(p.getPreferredDiet())
                .drinkingHabit(p.getDrinkingHabit())
                .smokingHabit(p.getSmokingHabit())
                .profileManagedBy(p.getProfileManagedBy())
                .preferWorkingProfessional(p.getPreferWorkingProfessional())
                .preferNri(p.getPreferNri())
                .showVerifiedOnly(p.getShowVerifiedOnly())
                .enableAutoMatch(p.getEnableAutoMatch())
                .matchScoreThreshold(p.getMatchScoreThreshold())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}

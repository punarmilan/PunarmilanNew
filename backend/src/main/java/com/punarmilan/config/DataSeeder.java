package com.punarmilan.config;

import com.punarmilan.entity.SubscriptionPlan;
import com.punarmilan.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SubscriptionPlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        if (planRepository.count() == 0) {
            System.out.println("Seeding Subscription Plans...");

            SubscriptionPlan basic = SubscriptionPlan.builder()
                    .name("Basic Plan")
                    .description("Standard profile features")
                    .price(new BigDecimal("999"))
                    .durationInDays(30)
                    .durationLabel("1 Month")
                    .connects(50)
                    .active(true)
                    .discountPercentage(0)
                    .highlightTag(null)
                    .features("Basic Support,50 Connects,Standard Visibility")
                    .build();

            SubscriptionPlan gold = SubscriptionPlan.builder()
                    .name("Gold Plan")
                    .description("Premium profile features")
                    .price(new BigDecimal("2499"))
                    .durationInDays(90)
                    .durationLabel("3 Months")
                    .connects(200)
                    .active(true)
                    .discountPercentage(10)
                    .highlightTag("Top Seller")
                    .features("Priority Support,200 Connects,High Visibility,Profile Boosting")
                    .build();

            SubscriptionPlan diamond = SubscriptionPlan.builder()
                    .name("Diamond Plan")
                    .description("Elite profile features")
                    .price(new BigDecimal("4999"))
                    .durationInDays(180)
                    .durationLabel("6 Months")
                    .connects(500)
                    .active(true)
                    .discountPercentage(20)
                    .highlightTag("Best Value")
                    .features("24/7 Dedicated Support,500 Connects,Maximum Visibility,Free Profile Boosting,Personal Relationship Manager")
                    .build();

            planRepository.saveAll(Arrays.asList(basic, gold, diamond));
            System.out.println("Seeding completed!");
        }
    }
}

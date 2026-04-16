package com.LoginRegister.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.LoginRegister.example.entity.Purchase;

public interface PurchaseRepo extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserEmail(String userEmail);
}
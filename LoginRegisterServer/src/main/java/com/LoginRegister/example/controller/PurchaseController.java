package com.LoginRegister.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.LoginRegister.example.entity.Purchase;
import com.LoginRegister.example.repository.PurchaseRepo;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseController {

    @Autowired
    private PurchaseRepo repo;

    @PostMapping("/buyCourse")
    public Purchase buyCourse(@RequestBody Purchase purchase) {
        return repo.save(purchase);
    }

    @GetMapping("/myCourses/{email}")
    public List<Purchase> getCourses(@PathVariable String email) {
        return repo.findByUserEmail(email);
    }
    
    @GetMapping("/allCourses")
    public List<Purchase> getAllCourses() {
        return repo.findAll();
    }
    
    @DeleteMapping("/deleteCourse/{id}")
    public String deleteCourse(@PathVariable Long id) {
        repo.deleteById(id);
        return "Course deleted successfully";
    }
    

    
 
 
}
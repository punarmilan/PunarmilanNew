package com.punarmilan.service;

public interface MailService {
    void sendPasswordResetEmail(String to, String resetLink);
}

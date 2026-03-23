package com.punarmilan.service;

public interface MailService {
    void sendPasswordResetEmail(String to, String resetLink);
    void sendVerificationEmail(String to, String verificationLink);
    void sendVerificationSuccessEmail(String to);
    void sendReferralEmail(String to, String senderName);
}

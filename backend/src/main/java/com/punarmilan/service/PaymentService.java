package com.punarmilan.service;

import com.punarmilan.dto.PaymentOrderResponse;
import com.punarmilan.dto.PaymentVerificationRequest;
import com.punarmilan.entity.UserSubscription;

import com.punarmilan.entity.User;

public interface PaymentService {
    PaymentOrderResponse createOrder(Long planId, User user);
    UserSubscription verifyPayment(PaymentVerificationRequest request, User user);
}

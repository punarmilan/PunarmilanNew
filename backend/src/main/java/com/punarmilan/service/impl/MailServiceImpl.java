package com.punarmilan.service.impl;

import com.punarmilan.service.MailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MailServiceImpl implements MailService {

    @Value("${punarmilan.sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${punarmilan.sendgrid.from-email}")
    private String fromEmail;

    @Value("${punarmilan.sendgrid.from-name}")
    private String fromName;

    @org.springframework.scheduling.annotation.Async("taskExecutor")
    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        Email from = new Email(fromEmail, fromName);
        String subject = "Reset Your Password - Punarmilan";
        Email toEmail = new Email(to);
        
        String htmlContent = "<p>Hello,</p>"
                + "<p>You have requested to reset your password.</p>"
                + "<p>Click the link below to change your password:</p>"
                + "<p><a href=\"" + resetLink + "\">Change my password</a></p>"
                + "<br>"
                + "<p>Ignore this email if you do remember your password, "
                + "or you have not made the request.</p>";
        
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            log.info("SendGrid response: Status Code: {}, Body: {}", response.getStatusCode(), response.getBody());
            if (response.getStatusCode() >= 400) {
                log.error("Failed to send SendGrid email. Status: {}", response.getStatusCode());
            }
        } catch (Exception ex) {
            log.error("Exception while sending SendGrid email to {}: {}", to, ex.getMessage());
        }
    }
}

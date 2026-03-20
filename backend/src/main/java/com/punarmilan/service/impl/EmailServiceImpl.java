package com.punarmilan.service.impl;

import com.punarmilan.service.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.TemplateEngine;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final TemplateEngine templateEngine;

    @Value("${punarmilan.sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${punarmilan.sendgrid.from-email}")
    private String fromEmail;

    @Value("${punarmilan.sendgrid.from-name}")
    private String fromName;

    @Override
    @Async("taskExecutor")
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        log.info("Preparing to send HTML email via SendGrid to: {} with subject: {}", to, subject);
        try {
            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process("emails/" + templateName, context);

            Email from = new Email(fromEmail, fromName);
            Email toEmail = new Email(to);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            log.info("SendGrid response for notification email: Status Code: {}", response.getStatusCode());
            
            if (response.getStatusCode() >= 400) {
                log.error("Failed to send notification email via SendGrid. Body: {}", response.getBody());
            }
        } catch (Exception e) {
            log.error("Unexpected error while sending HTML email via SendGrid to: {}. Error: {}", to, e.getMessage());
        }
    }
}

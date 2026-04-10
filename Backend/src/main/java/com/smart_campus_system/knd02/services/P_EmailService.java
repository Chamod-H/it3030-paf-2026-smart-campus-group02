package com.smart_campus_system.knd02.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class P_EmailService {

    private final JavaMailSender mailSender;

    public P_EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("security@smartcampus.sliit.lk");
        message.setTo(toEmail);
        message.setSubject("Smart Campus - Password Reset Requested");
        message.setText("You requested a password reset.\n\nYour 6-digit OTP code is: " + otpCode + 
                        "\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.");

        // NOTE: if spring.mail.username/password are empty in application.properties, this will fail.
        mailSender.send(message);
    }
}

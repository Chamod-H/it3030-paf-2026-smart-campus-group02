package com.smart_campus_system.knd02.controllers;

import com.smart_campus_system.knd02.dto.P_ForgotPasswordRequest;
import com.smart_campus_system.knd02.dto.P_ResetPasswordRequest;
import com.smart_campus_system.knd02.models.P_PasswordResetToken;
import com.smart_campus_system.knd02.models.User;
import com.smart_campus_system.knd02.repositories.P_PasswordResetRepository;
import com.smart_campus_system.knd02.repositories.UserRepository;
import com.smart_campus_system.knd02.services.P_EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth/password")
public class P_PasswordResetController {

    private final UserRepository userRepository;
    private final P_PasswordResetRepository passwordResetRepository;
    private final P_EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public P_PasswordResetController(UserRepository userRepository, 
                                     P_PasswordResetRepository passwordResetRepository, 
                                     P_EmailService emailService,
                                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody P_ForgotPasswordRequest request) {
        String email = request.getEmail();

        if (email == null || !email.endsWith("@my.sliit.lk")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid domain. Please use your @my.sliit.lk student email."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // For security, do not reveal if the email is registered or not
            return ResponseEntity.ok(Map.of("message", "If an account exists with this email, an OTP has been sent."));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Print to console strictly for testing in case email configuration is skipped/invalid by user
        System.out.println("============================================");
        System.out.println("DEBUG OTP CODE FOR " + email + " : " + otp);
        System.out.println("============================================");

        // Delete old token if exists, save new one (10 min expiry)
        passwordResetRepository.deleteByEmail(email);
        P_PasswordResetToken myToken = new P_PasswordResetToken(email, otp, LocalDateTime.now().plusMinutes(10));
        passwordResetRepository.save(myToken);

        // Try sending real email
        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.err.println("Could not send email because SMTP is perfectly unconfigured or blocked: " + e.getMessage());
            // Do not fail the request; the user will rely on console OTP printout
        }

        return ResponseEntity.ok(Map.of("message", "If an account exists with this email, an OTP has been sent."));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody P_ResetPasswordRequest request) {
        String email = request.getEmail();
        String otp = request.getOtpToken();
        String newPassword = request.getNewPassword();

        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters long"));
        }

        Optional<P_PasswordResetToken> tokenOpt = passwordResetRepository.findByEmail(email);

        if (tokenOpt.isEmpty() || !tokenOpt.get().getOtpToken().equals(otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid or missing OTP code."));
        }

        if (tokenOpt.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetRepository.deleteByEmail(email);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "OTP Code has expired. Please request a new one."));
        }

        // Pass validation, update the password
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }

        // Clean up token
        passwordResetRepository.deleteByEmail(email);

        return ResponseEntity.ok(Map.of("message", "Password successfully reset. You may now securely login."));
    }
}

package com.smart_campus_system.knd02.controllers;

import com.smart_campus_system.knd02.dto.AuthRequest;
import com.smart_campus_system.knd02.dto.AuthResponse;
import com.smart_campus_system.knd02.dto.RegisterRequest;
import com.smart_campus_system.knd02.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // We drop to generic wildcards for quick scaffolding, standard practices isolate this locally
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Email or Password Credentials Payload.");
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody com.smart_campus_system.knd02.dto.GoogleLoginRequest request) {
        try {
            AuthResponse response = authService.googleLogin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}

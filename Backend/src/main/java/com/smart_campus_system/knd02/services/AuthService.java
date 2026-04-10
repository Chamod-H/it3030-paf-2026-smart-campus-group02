package com.smart_campus_system.knd02.services;

import com.smart_campus_system.knd02.dto.AuthRequest;
import com.smart_campus_system.knd02.dto.AuthResponse;
import com.smart_campus_system.knd02.dto.RegisterRequest;
import com.smart_campus_system.knd02.models.Role;
import com.smart_campus_system.knd02.models.User;
import com.smart_campus_system.knd02.repositories.UserRepository;
import com.smart_campus_system.knd02.security.CustomUserDetailsService;
import com.smart_campus_system.knd02.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                       CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered in the Smart Campus System.");
        }

        // Domain Validation matches React Logic exclusively permitting SLIIT student domains for external registration
        if (!request.getEmail().endsWith("@my.sliit.lk")) {
            throw new RuntimeException("Registration strictly restricted to valid @my.sliit.lk domains.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDepartment(request.getDepartment());
        user.setRole(Role.STUDENT); // Hardcoded: External registration ALWAYS defaults to Student. Admins manually create Staff/Lecturer.
        user.setActive(true);

        User savedUser = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(AuthResponse.UserData.fromUser(savedUser))
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found bridging logic gaps"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated. Contact Campus Administration.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(AuthResponse.UserData.fromUser(user))
                .build();
    }
}

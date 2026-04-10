package com.smart_campus_system.knd02.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String phone;
    private String password;
    private String department;
    // Roles are forcibly mapped based on email logic or parameters on the backend (usually defaults to STUDENT)
}

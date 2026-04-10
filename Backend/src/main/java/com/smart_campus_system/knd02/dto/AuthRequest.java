package com.smart_campus_system.knd02.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}

package com.smart_campus_system.knd02.dto;

import lombok.Data;

@Data
public class P_ResetPasswordRequest {
    private String email;
    private String otpToken;
    private String newPassword;
}

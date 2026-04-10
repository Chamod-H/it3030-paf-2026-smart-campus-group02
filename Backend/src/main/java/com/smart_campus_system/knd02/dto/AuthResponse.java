package com.smart_campus_system.knd02.dto;

import com.smart_campus_system.knd02.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserData user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserData {
        private String id;
        private String email;
        private String name;
        private String role;
        private String phone;
        private String department;
        
        // Converts MongoDB User entity securely to Frontend Payload implicitly stripping password
        public static UserData fromUser(User user) {
            return UserData.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getUsername())
                    .role(user.getRole().name())
                    .phone(user.getPhone())
                    .department(user.getDepartment())
                    .build();
        }
    }
}

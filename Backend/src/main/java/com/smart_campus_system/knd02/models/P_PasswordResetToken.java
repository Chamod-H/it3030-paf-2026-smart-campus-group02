package com.smart_campus_system.knd02.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "password_reset_tokens")
public class P_PasswordResetToken {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String otpToken;

    private LocalDateTime expiryDate;

    public P_PasswordResetToken(String email, String otpToken, LocalDateTime expiryDate) {
        this.email = email;
        this.otpToken = otpToken;
        this.expiryDate = expiryDate;
    }
}

package com.smart_campus_system.knd02.repositories;

import com.smart_campus_system.knd02.models.P_PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface P_PasswordResetRepository extends MongoRepository<P_PasswordResetToken, String> {
    Optional<P_PasswordResetToken> findByEmail(String email);
    void deleteByEmail(String email);
}

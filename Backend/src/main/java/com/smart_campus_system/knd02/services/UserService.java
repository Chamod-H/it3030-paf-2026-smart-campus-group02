package com.smart_campus_system.knd02.services;

import com.smart_campus_system.knd02.models.Role;
import com.smart_campus_system.knd02.models.User;
import com.smart_campus_system.knd02.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }
        
        // Encode password if provided
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Default role safety
        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }
        
        return userRepository.save(user);
    }

    public User updateUser(String id, User updatedUser) {
        User existingUser = getUserById(id);
        
        if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
        if (updatedUser.getPhone() != null) existingUser.setPhone(updatedUser.getPhone());
        if (updatedUser.getDepartment() != null) existingUser.setDepartment(updatedUser.getDepartment());
        if (updatedUser.getRole() != null) existingUser.setRole(updatedUser.getRole());
        
        // We only update email if it is unique to prevent conflicts
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(existingUser.getEmail())) {
             if (userRepository.existsByEmail(updatedUser.getEmail())) {
                  throw new RuntimeException("Email is already registered.");
             }
             existingUser.setEmail(updatedUser.getEmail());
        }

        // Only update password if explicitly provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        
        return userRepository.save(existingUser);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    public User updateUserRole(String id, String roleStr) {
        User user = getUserById(id);
        
        try {
            Role newRole = Role.valueOf(roleStr.toUpperCase());
            user.setRole(newRole);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role provided: " + roleStr);
        }
        
        return userRepository.save(user);
    }

    public List<User> filterUsers(Map<String, String> queryParams) {
        List<User> users = getAllUsers();
        
        String roleFilter = queryParams.get("role");
        if (roleFilter != null && !roleFilter.isEmpty()) {
            try {
                String formattedRole = roleFilter.toUpperCase();
                if (formattedRole.equals("STAFF")) {
                    formattedRole = "STAFF_MEMBER";
                }
                Role targetRole = Role.valueOf(formattedRole);
                users = users.stream()
                        .filter(u -> u.getRole() != null && u.getRole() == targetRole)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // If the role is completely invalid, return no users instead of all users
                return new java.util.ArrayList<>();
            }
        }
        
        return users;
    }
}

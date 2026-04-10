package com.smart_campus_system.knd02.controllers;

import com.smart_campus_system.knd02.models.User;
import com.smart_campus_system.knd02.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(@RequestParam Map<String, String> params) {
        if (params.isEmpty()) {
            return ResponseEntity.ok(userService.getAllUsers());
        }
        return ResponseEntity.ok(userService.filterUsers(params));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    private User parsePayloadToUser(Map<String, String> payload) {
        User user = new User();
        user.setUsername(payload.get("username"));
        user.setEmail(payload.get("email"));
        user.setPhone(payload.get("phone"));
        user.setDepartment(payload.get("department"));
        user.setPassword(payload.get("password"));
        
        if (payload.get("role") != null && !payload.get("role").isEmpty()) {
            user.setRole(com.smart_campus_system.knd02.models.Role.valueOf(payload.get("role").toUpperCase()));
        }
        return user;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> payload) {
        try {
            User user = parsePayloadToUser(payload);
            return ResponseEntity.ok(userService.createUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Structure Mapping Failed: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            User user = parsePayloadToUser(payload);
            return ResponseEntity.ok(userService.updateUser(id, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Structure Mapping Failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String role = payload.get("role");
        if (role == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }
}

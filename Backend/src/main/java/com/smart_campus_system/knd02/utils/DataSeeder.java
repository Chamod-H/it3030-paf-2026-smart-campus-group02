package com.smart_campus_system.knd02.utils;

import com.smart_campus_system.knd02.models.Role;
import com.smart_campus_system.knd02.models.User;
import com.smart_campus_system.knd02.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        
        // Base Admin Seeder Payload (Overlord Account)
        if (!userRepository.existsByEmail("admin@my.sliit.lk")) {
            User admin = new User();
            admin.setUsername("System Admin");
            admin.setEmail("admin@my.sliit.lk");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setDepartment("IT Operations");
            admin.setPhone("0710000001");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("✅ Generated Global Dummy Admin => admin@my.sliit.lk / admin123");
        }

        // Base Lecturer Seeder Payload
        if (!userRepository.existsByEmail("lecturer@my.sliit.lk")) {
            User lecturer = new User();
            lecturer.setUsername("Dr. Lecturer");
            lecturer.setEmail("lecturer@my.sliit.lk");
            lecturer.setPassword(passwordEncoder.encode("lecturer123"));
            lecturer.setDepartment("Computer Science");
            lecturer.setPhone("0710000002");
            lecturer.setRole(Role.LECTURER);
            lecturer.setActive(true);
            userRepository.save(lecturer);
            System.out.println("✅ Generated Dummy Lecturer => lecturer@my.sliit.lk / lecturer123");
        }

        // Base Student Seeder Payload
        if (!userRepository.existsByEmail("student@my.sliit.lk")) {
            User student = new User();
            student.setUsername("John Student");
            student.setEmail("student@my.sliit.lk");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setDepartment("Software Engineering");
            student.setPhone("0710000003");
            student.setRole(Role.STUDENT);
            student.setActive(true);
            userRepository.save(student);
            System.out.println("✅ Generated Dummy Student => student@my.sliit.lk / student123");
        }

        // Base Staff Seeder Payload
        if (!userRepository.existsByEmail("staff@my.sliit.lk")) {
            User staff = new User();
            staff.setUsername("Bob Technician");
            staff.setEmail("staff@my.sliit.lk");
            staff.setPassword(passwordEncoder.encode("staff123"));
            staff.setDepartment("Facilities Maintenance");
            staff.setPhone("0710000004");
            staff.setRole(Role.STAFF_MEMBER);
            staff.setActive(true);
            userRepository.save(staff);
            System.out.println("✅ Generated Dummy Staff Member => staff@my.sliit.lk / staff123");
        }
    }
}

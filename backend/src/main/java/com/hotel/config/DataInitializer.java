package com.hotel.config;

import com.hotel.entity.Role;
import com.hotel.entity.User;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if no users exist
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@hotel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91-9999999999")
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);

            User staff = User.builder()
                    .firstName("Staff")
                    .lastName("Member")
                    .email("staff@hotel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91-8888888888")
                    .role(Role.STAFF)
                    .active(true)
                    .build();
            userRepository.save(staff);

            User customer = User.builder()
                    .firstName("Rahul")
                    .lastName("Sharma")
                    .email("customer@hotel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91-7777777777")
                    .role(Role.CUSTOMER)
                    .active(true)
                    .build();
            userRepository.save(customer);

            log.info("✅ Default users created: admin@hotel.com / staff@hotel.com / customer@hotel.com (password: admin123)");
        }
    }
}

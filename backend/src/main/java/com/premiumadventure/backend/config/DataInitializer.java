package com.premiumadventure.backend.config;

import com.premiumadventure.backend.model.ERole;
import com.premiumadventure.backend.model.Role;
import com.premiumadventure.backend.model.GUser;
import com.premiumadventure.backend.repository.RoleRepository;
import com.premiumadventure.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_USER));
        }
        if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
        }
        if (!roleRepository.findByName(ERole.ROLE_STAFF).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_STAFF));
        }
        if (!roleRepository.findByName(ERole.ROLE_PILOT).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_PILOT));
        }

        // Initialize Admin User
        if (!userRepository.existsByUsername("admin")) {
            GUser admin = new GUser();
            admin.setUsername("admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(encoder.encode("admin"));
            admin.setWalletBalance(1000000.0);

            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin");
        }
    }
}

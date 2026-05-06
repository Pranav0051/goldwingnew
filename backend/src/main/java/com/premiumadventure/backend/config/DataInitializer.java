package com.premiumadventure.backend.config;

import com.premiumadventure.backend.model.ERole;
import com.premiumadventure.backend.model.Role;
import com.premiumadventure.backend.model.FlightSlot;
import com.premiumadventure.backend.model.GUser;
import com.premiumadventure.backend.repository.RoleRepository;
import com.premiumadventure.backend.repository.SlotRepository;
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
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_USER));
        }
        if (roleRepository.findByName(ERole.ROLE_MODERATOR).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_MODERATOR));
        }
        if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_ADMIN));
        }
        if (roleRepository.findByName(ERole.ROLE_STAFF).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_STAFF));
        }
        if (roleRepository.findByName(ERole.ROLE_PILOT).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_PILOT));
        }

        System.out.println("Total Users: " + userRepository.count());

        // Ensure default admin user exists
        createOrUpdateUser("admin", "admin@gmail.com", "admin", null, null, null, ERole.ROLE_ADMIN, ERole.ROLE_MODERATOR, ERole.ROLE_USER, ERole.ROLE_STAFF, ERole.ROLE_PILOT);
        
        // Ensure default slots exist
        if (slotRepository.count() == 0) {
            slotRepository.save(new FlightSlot(null, "06:00 AM", 20));
            slotRepository.save(new FlightSlot(null, "07:30 AM", 20));
            slotRepository.save(new FlightSlot(null, "04:30 PM", 20));
        }

        System.out.println("Default admin user synchronized for Production: admin (Password: admin). Please change password after first login.");
    }

    private GUser createOrUpdateUser(String username, String email, String password, String staffId, String agentId, String pilotId, ERole... roleNames) {
        GUser gUser = userRepository.findByUsername(username).orElse(null);
        Set<Role> roles = new HashSet<>();
        for (ERole roleName : roleNames) {
            roles.add(roleRepository.findByName(roleName).get());
        }

        if (gUser == null) {
            gUser = new GUser();
            gUser.setUsername(username);
            gUser.setEmail(email);
            gUser.setPassword(encoder.encode(password));
            gUser.setStaffId(staffId);
            gUser.setAgentId(agentId);
            gUser.setPilotId(pilotId);
            gUser.setWalletBalance(0.0);
            gUser.setRoles(roles);
            userRepository.save(gUser);
        } else {
            gUser.setRoles(roles);
            gUser.setPassword(encoder.encode(password));
            gUser.setStaffId(staffId);
            gUser.setAgentId(agentId);
            gUser.setPilotId(pilotId);
            userRepository.save(gUser);
        }
        return gUser;
    }
}

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
            System.out.println("Role ROLE_USER created.");
        }
        if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            System.out.println("Role ROLE_ADMIN created.");
        }
        if (!roleRepository.findByName(ERole.ROLE_STAFF).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_STAFF));
            System.out.println("Role ROLE_STAFF created.");
        }
        if (!roleRepository.findByName(ERole.ROLE_PILOT).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_PILOT));
            System.out.println("Role ROLE_PILOT created.");
        }
        if (!roleRepository.findByName(ERole.ROLE_MODERATOR).isPresent()) {
            roleRepository.save(new Role(ERole.ROLE_MODERATOR));
            System.out.println("Role ROLE_MODERATOR created.");
        }

        // Initialize Admin User
        if (!userRepository.existsByUsername("admin")) {
            GUser admin = new GUser();
            admin.setUsername("admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(encoder.encode("admin"));
            admin.setWalletBalance(1000000.0);

            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(ERole.ROLE_ADMIN).get());
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin");
        }

        // Initialize Staff User
        if (!userRepository.existsByUsername("staff")) {
            GUser staff = new GUser();
            staff.setUsername("staff");
            staff.setEmail("staff@gmail.com");
            staff.setPassword(encoder.encode("staff"));
            staff.setWalletBalance(0.0);

            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(ERole.ROLE_STAFF).get());
            staff.setRoles(roles);
            staff.setStaffId("STF-INIT-001");
            userRepository.save(staff);
            System.out.println("Default staff user created: staff/staff");
        }

        // Initialize Pilot User
        if (!userRepository.existsByUsername("pilot")) {
            GUser pilot = new GUser();
            pilot.setUsername("pilot");
            pilot.setEmail("pilot@gmail.com");
            pilot.setPassword(encoder.encode("pilot"));
            pilot.setWalletBalance(0.0);

            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(ERole.ROLE_PILOT).get());
            pilot.setRoles(roles);
            pilot.setPilotId("PLT-INIT-001");
            userRepository.save(pilot);
            System.out.println("Default pilot user created: pilot/pilot");
        }

        // Initialize Agent User
        if (!userRepository.existsByUsername("agent")) {
            GUser agent = new GUser();
            agent.setUsername("agent");
            agent.setEmail("agent@gmail.com");
            agent.setPassword(encoder.encode("agent"));
            agent.setWalletBalance(1000.0);

            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(ERole.ROLE_USER).get());
            agent.setRoles(roles);
            agent.setAgentId("AGT-INIT-001");
            userRepository.save(agent);
            System.out.println("Default agent user created: agent/agent");
        }
    }
}

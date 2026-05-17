package com.premiumadventure.backend.controller;

import com.premiumadventure.backend.model.ERole;
import com.premiumadventure.backend.model.Role;
import com.premiumadventure.backend.model.GUser;
import com.premiumadventure.backend.payload.request.LoginRequest;
import com.premiumadventure.backend.payload.request.SignupRequest;
import com.premiumadventure.backend.payload.response.JwtResponse;
import com.premiumadventure.backend.payload.response.MessageResponse;
import com.premiumadventure.backend.repository.RoleRepository;
import com.premiumadventure.backend.repository.UserRepository;
import com.premiumadventure.backend.security.JwtUtils;
import com.premiumadventure.backend.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping({"/signin", "/login"})
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles,
                    userDetails.getAgentId(),
                    userDetails.getStaffId(),
                    userDetails.getPilotId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new GUser's account
        GUser gUser = new GUser();
        gUser.setUsername(signUpRequest.getUsername());
        gUser.setEmail(signUpRequest.getEmail());
        gUser.setPassword(encoder.encode(signUpRequest.getPassword()));
        gUser.setWalletBalance(0.0);

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            gUser.setAgentId(generateId("AGT"));
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "staff":
                        Role staffRole = roleRepository.findByName(ERole.ROLE_STAFF)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(staffRole);
                        gUser.setStaffId(generateId("STF"));
                        break;
                    case "agent":
                        Role agentRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(agentRole);
                        gUser.setAgentId(generateId("AGT"));
                        break;
                    case "pilot":
                        Role pilotRole = roleRepository.findByName(ERole.ROLE_PILOT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(pilotRole);
                        gUser.setPilotId(generateId("PLT"));
                        break;
                    case "mod": // keeping this for backwards compatibility
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                        gUser.setAgentId(generateId("AGT"));
                }
            });
        }

        gUser.setRoles(roles);
        userRepository.save(gUser);

        return ResponseEntity.ok(new MessageResponse("GUser registered successfully!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            jwtUtils.invalidateToken(token);
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("Logged out successfully."));
    }

    private String generateId(String prefix) {
        return prefix + "-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

package com.premiumadventure.backend.controller;

import com.premiumadventure.backend.model.GUser;
import com.premiumadventure.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/GUser")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }
}

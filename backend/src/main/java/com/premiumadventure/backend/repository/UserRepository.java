package com.premiumadventure.backend.repository;

import com.premiumadventure.backend.model.GUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<GUser, Long> {
    Optional<GUser> findByUsername(String username);

    Optional<GUser> findByEmail(String email);

    Optional<GUser> findByAgentId(String agentId);

    Optional<GUser> findByUsernameOrEmail(String username, String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}

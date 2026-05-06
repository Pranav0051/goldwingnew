package com.premiumadventure.backend.payload.response;

import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private String agentId;
    private String staffId;
    private String pilotId;

    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles, String agentId, String staffId, String pilotId) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.agentId = agentId;
        this.staffId = staffId;
        this.pilotId = pilotId;
    }
}

package com.premiumadventure.backend.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.premiumadventure.backend.model.GUser;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private String agentId;
    private String staffId;
    private String pilotId;

    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(GUser GUser) {
        List<GrantedAuthority> authorities = GUser.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                GUser.getId(),
                GUser.getUsername(),
                GUser.getEmail(),
                GUser.getPassword(),
                GUser.getAgentId(),
                GUser.getStaffId(),
                GUser.getPilotId(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl GUser = (UserDetailsImpl) o;
        return Objects.equals(id, GUser.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

package com.hotel.service;

import com.hotel.dto.request.RegisterRequest;
import com.hotel.dto.response.AuthResponse;
import com.hotel.entity.Role;
import com.hotel.entity.User;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ConflictException;
import com.hotel.repository.UserRepository;
import com.hotel.security.JwtUtils;
import com.hotel.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository      userRepository;
    private final PasswordEncoder     passwordEncoder;
    private final JwtUtils            jwtUtils;
    private final AuthenticationManager authManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new ConflictException("Email already registered");
        User user = User.builder()
                .firstName(request.getFirstName()).lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.CUSTOMER).active(true).build();
        user = userRepository.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(String email, String password) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        return buildResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        try {
            String email = jwtUtils.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadRequestException("Invalid refresh token"));
            return buildResponse(user);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Invalid or expired refresh token");
        }
    }

    private AuthResponse buildResponse(User user) {
        UserPrincipal principal = new UserPrincipal(user);
        return AuthResponse.builder()
                .accessToken(jwtUtils.generateToken(principal))
                .refreshToken(jwtUtils.generateRefreshToken(user.getEmail()))
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}

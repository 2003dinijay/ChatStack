package com.chatstack.authservice.controllers;

import com.chatstack.authservice.dto.AuthResponse;
import com.chatstack.authservice.dto.LoginRequest;
import com.chatstack.authservice.entities.User;
import com.chatstack.authservice.repositories.UserRepository;
import com.chatstack.authservice.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user){
        return ResponseEntity.ok(authService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
        String token = authService.login(loginRequest);
        User user = authService.getUserByUsername(loginRequest.username);
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Principal principal){
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Long userId = Long.parseLong(principal.getName());

        return userRepository.findById(userId)
                .map(user -> {
                    // Return a Map or a DTO so we don't send the password hash!
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getId());
                    response.put("username", user.getUsername());
                    // add other fields you need like email or profile picture
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

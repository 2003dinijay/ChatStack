package com.chatstack.authservice.controllers;

import com.chatstack.authservice.dto.AuthResponse;
import com.chatstack.authservice.dto.LoginRequest;
import com.chatstack.authservice.entities.User;
import com.chatstack.authservice.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

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
}

package com.chatstack.authservice.controllers;

import com.chatstack.authservice.dto.UserDto;
import com.chatstack.authservice.entities.User;
import com.chatstack.authservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Internal API for service-to-service communication
 * Should NOT be exposed publicly in production (use internal network or API gateway)
 */
@RestController
@RequestMapping("/api/internal/users")
public class InternalUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/batch")
    public ResponseEntity<List<UserDto>> getUsersByIds(@RequestBody Map<String, List<Long>> request) {
        List<Long> ids = request.get("ids");
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<User> users = userRepository.findAllById(ids);
        List<UserDto> userDtos = users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/exists/username/{username}")
    public ResponseEntity<Map<String, Boolean>> userExistsByUsername(@PathVariable String username) {
        boolean exists = userRepository.existsByUsername(username);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Map<String, Boolean>> userExistsByEmail(@PathVariable String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setEnabled(user.getEnabled());
        return dto;
    }
}

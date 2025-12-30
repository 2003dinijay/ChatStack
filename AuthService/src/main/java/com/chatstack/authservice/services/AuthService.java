package com.chatstack.authservice.services;

import com.chatstack.authservice.config.RabbitMQConfig;
import com.chatstack.authservice.dto.LoginRequest;
import com.chatstack.authservice.entities.User;
import com.chatstack.authservice.repositories.UserRepository;
import com.chatstack.authservice.security.JwtUtil;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Transactional
    public User registerUser(User user){
        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return userRepository.save(user);
        User savedUser = userRepository.save(user);

        Map<String, Object> message = new HashMap<>();
        message.put("id", savedUser.getId());
        message.put("username", savedUser.getUsername());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                message
        );
        return savedUser;
    }

    public String login(LoginRequest loginRequest){
        User user = userRepository.findByUsername(loginRequest.username)
                .orElseThrow(() -> new RuntimeException("Username not found"));

        if (passwordEncoder.matches(loginRequest.password, user.getPassword())){
            return jwtUtil.generateToken(user);
        }
        else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public User getUserByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("Username not found"));
    }
}

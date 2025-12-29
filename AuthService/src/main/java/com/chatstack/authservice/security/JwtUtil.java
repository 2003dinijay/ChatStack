package com.chatstack.authservice.security;

import com.chatstack.authservice.entities.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String secret = System.getenv("JWT_SECRET");
    private final Key key = Keys.hmacShaKeyFor(secret.getBytes());
    private final int expirationMs = 864000000; // 24 hours

    public String generateToken(User user){
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime()+ expirationMs))
                .signWith(key)
                .compact();
    }

    public String extractSubject(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key) // This is the 'key' you defined at the top of the class
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            // If the token is expired, tampered with, or invalid, return null
            return null;
        }
    }
}

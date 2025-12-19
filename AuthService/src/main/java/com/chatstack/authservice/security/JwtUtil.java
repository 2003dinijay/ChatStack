package com.chatstack.authservice.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.xml.crypto.Data;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String secret = System.getenv("JWT_SECRET");
    private final Key key = Keys.hmacShaKeyFor(secret.getBytes());
    private final int expirationMs = 864000000; // 24 hours

    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime()+ expirationMs))
                .signWith(key)
                .compact();
    }
}

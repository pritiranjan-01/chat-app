package com.chat.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${spring.security.secretKey}")
    private String SECRET;

    private static final Duration ACCESS_TOKEN_EXPIRATION_TIME = Duration.ofMinutes(60); // 60 Minutes

    public String generateToken(String username) {
        return "Bearer " +Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME.toMillis()))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        Date expiredTime = getExpirationTimeFromToken(token);
        return username.equals(userDetails.getUsername()) && expiredTime.after(new Date());
    }

    public String getUsernameFromToken(String token) {
        return extractToken(token).getSubject();
    }

    public Date getExpirationTimeFromToken(String token) {
        return extractToken(token).getExpiration();
    }

    private Claims extractToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}

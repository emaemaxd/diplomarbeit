package org.threeDPortfolioGallery;

import io.smallrye.jwt.build.Jwt;
import jakarta.inject.Singleton;

import java.util.*;

// TODO ändern wegen roles
@Singleton
public class JwtService {
    public String generateJwt(Long id){
        return Jwt.issuer("user-jwt")
                .claim("userid", id)
                .subject("user-jwt")
                .groups(Set.of("user", "admin"))
                .expiresAt(
                        System.currentTimeMillis() + 3600000
                ).sign();
    }
    public String generateJwt(){
        return Jwt.issuer("user-jwt")
                .subject("userjwt")
                .groups(Set.of("user", "admin"))
                .expiresAt(
                        System.currentTimeMillis() + 3600000
                ).sign();
    }
}

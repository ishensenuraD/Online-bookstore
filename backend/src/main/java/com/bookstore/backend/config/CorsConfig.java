package com.bookstore.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        // Allow all origins (for development) - change to specific origin in production
        configuration.addAllowedOriginPattern("*");
        
        // Allow all headers
        configuration.addAllowedHeader("*");
        
        // Allow all methods
        configuration.addAllowedMethod("*");
        
        // Expose Authorization header
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}


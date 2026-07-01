package com.springboot.jobportal.config;

import com.springboot.jobportal.service.CustomUserDetailService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@AllArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailService customUserDetailService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        // Configs
        httpSecurity
                // Sign authentication provider
                .authenticationProvider(authenticationProvider())

                // Disable csrf because JWT does not use sessions
                .csrf(AbstractHttpConfigurer::disable)

                // Configs for paths
                .authorizeHttpRequests(config -> config

                        // Swagger, Auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/api/auth/**")
                        .permitAll()

                        // Admin Role
                        .requestMatchers(
                                "/auth/users/**"
                        ).hasRole("ADMIN")
                        .anyRequest().authenticated()
                );

        // Configure how to handle authentication failures
        httpSecurity.exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(authenticationEntryPoint())
        );

        // Say with Spring Security: Does NOT use Sessions (By default Spring Security use Session)
        // STATELESS: The login state is not saved on the server.
        //  + Do not create sessions
        //  + Do not save login state
        //  + Do not use JSESSIONID
        httpSecurity.sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // Add JWT filters to the Security Filter Chain run BEFORE UsernamePasswordAuthenticationFilter
        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // CORS config
        httpSecurity.cors(Customizer.withDefaults());

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(customUserDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // AuthenticationConfiguration is object containing the current authentication configuration.
        // Spring Security automatically builds the AuthenticationManager based on your configuration.
        // Example Flow:
        //      DaoAuthenticationProvider -> UserDetailsService -> PasswordEncoder
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            // Set the HTTP Status Code for the response returned to the client.
            // Example:
            //  404 Not Found
            //  500 Internal Server Error
            //  401 Unauthorized
            response.setStatus(HttpStatus.UNAUTHORIZED.value());


            // Declare the data type of the returned response as JSON.
            response.setContentType("application/json"); // FIXED TYPO HERE

            // TURN OFF POPUP
            // Default SpringSecurity response:
            //  + HTTP/1.1 401 Unauthorized
            //  + WWW-Authenticate: Basic realm="Realm"
            //
            // After setHeader (Override):
            //  + HTTP/1.1 401 Unauthorized
            //  + WWW-Authenticate:
            response.setHeader("WWW-Authenticate", "");

            // Write the body content to the HTTP response:
            // Result:
            //      {
            //          "error": "Unauthorized access"
            //      }
            response.getWriter().write("{\"error\": \"Unauthorized access\"}");
        };
    }
}
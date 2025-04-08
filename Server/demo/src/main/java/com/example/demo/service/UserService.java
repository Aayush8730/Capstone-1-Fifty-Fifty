package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserService() {
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User addUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void registerUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }


    public boolean isEmailInUse(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public ResponseEntity<AuthResponse> verify(User user) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getName(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getName());
            Long userId = userRepository.findByName(user.getName()).getUserId();

            AuthResponse response = new AuthResponse(token, userId);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    public boolean isUsernameInUse(String name) {
        User user = userRepository.findByName(name);
        return user != null;
    }
    }



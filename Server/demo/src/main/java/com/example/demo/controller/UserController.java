package com.example.demo.controller;

import com.example.demo.dto.AuthResponse;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody User user) {
        return userService.verify(user);
    }


    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userService.isEmailInUse(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
        }

        if (userService.isUsernameInUse(user.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }

        if (user.getPassword().length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters long");
        }

        if (!user.getEmail().endsWith("@gmail.com")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email must end with @gmail.com");
        }
        userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @GetMapping("/{id:[0-9]+}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @DeleteMapping("/{id:[0-9]+}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}


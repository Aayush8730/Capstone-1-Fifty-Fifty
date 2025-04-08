package com.example.demo.service;

import com.example.demo.model.UserPrincipal;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    @Autowired
    public MyUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Looking for user: " + username);
        User user = repository.findByName(username);

        if (user == null) {
            System.out.println("User not found in database for username: " + username);
            throw new UsernameNotFoundException("User not found");
        }

        System.out.println("User found: " + user.getName());
        return new UserPrincipal(user);
    }
}
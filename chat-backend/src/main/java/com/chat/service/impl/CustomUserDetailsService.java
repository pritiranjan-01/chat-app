package com.chat.service.impl;

import com.chat.entity.User;
import com.chat.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
       final User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("email not found"));
       return new org.springframework.security.core.userdetails.User(
               user.getEmail(),
               user.getPassword(),
               List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }
}

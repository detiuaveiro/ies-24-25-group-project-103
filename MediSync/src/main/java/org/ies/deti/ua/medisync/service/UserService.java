package org.ies.deti.ua.medisync.service;

import org.ies.deti.ua.medisync.model.User;
import org.ies.deti.ua.medisync.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public User createUser(User user, String password) {
        user.setPassword(password);
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    public void updateProfilePicture(Long userId, String profilePictureUrl) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfilePictureUrl(profilePictureUrl);
        userRepository.save(user);
    }
}
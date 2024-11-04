package org.ies.deti.ua.medisync.controller;

import org.ies.deti.ua.medisync.model.User;
import org.ies.deti.ua.medisync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create a new user
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user, @RequestParam String password) {
        User createdUser = userService.createUser(user, password);
        return ResponseEntity.ok(createdUser);
    }

    // Update password (not tested because I forgot)
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<User> updatePassword(
            @PathVariable Long userId,
            @RequestParam String newPassword) {
        User updatedUser = userService.updateUserPassword(userId, newPassword);
        return ResponseEntity.ok(updatedUser);
    }
}
package org.ies.deti.ua.medisync.controller;

import java.io.File;
import java.io.IOException;

import org.apache.http.HttpStatus;
import org.ies.deti.ua.medisync.model.User;
import org.ies.deti.ua.medisync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest; // Import HttpServletRequest

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // End point to see all users
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user, @RequestParam String password) {
        User createdUser = userService.createUser(user, password);
        if (createdUser == null) {
            return ResponseEntity.status(HttpStatus.SC_CONFLICT).build();
        }
        return ResponseEntity.ok(createdUser);
    }

    // Created this in case we need to delete the existing hospital manager (should never be needed)
    @DeleteMapping
    public ResponseEntity<User> deleteUser() {
        userService.deleteUser();

        return ResponseEntity.ok().build();
    }

    /*
    // Update password (not tested because I forgot)
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<User> updatePassword(
            @PathVariable Long userId,
            @RequestParam String newPassword) {
        User updatedUser = userService.updateUserPassword(userId, newPassword);
        return ResponseEntity.ok(updatedUser);
    }
     */

    @PostMapping("/{id}/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@PathVariable Long id, 
                                                      @RequestParam("file") MultipartFile file,
                                                      HttpServletRequest request) { // Add request parameter
        String uploadDir = "/tmp/tomcat/uploads/"; 

        try {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                if (!created) {
                    throw new IOException("Failed to create upload directory: " + uploadDir);
                }
            }
            String filename = id + "_" + file.getOriginalFilename();
            File destinationFile = new File(directory, filename);
            file.transferTo(destinationFile);

            String baseUrl = request.getRequestURL().toString(); 
            baseUrl = baseUrl.substring(0, baseUrl.length() - request.getRequestURI().length());

            String imageUrl = baseUrl + "/uploads/" + destinationFile.getName(); 
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                                 .body("Failed to upload file: " + e.getMessage());
        }
    }
}
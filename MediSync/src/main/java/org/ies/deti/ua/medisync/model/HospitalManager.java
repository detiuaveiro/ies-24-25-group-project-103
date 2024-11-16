package org.ies.deti.ua.medisync.model;

import jakarta.persistence.Entity;

@Entity
public class HospitalManager extends User {

    public HospitalManager() {}

    public HospitalManager(String username, String email, String password, String name, String role, String profilePictureUrl) {
        super(username, email, password,name, "HOSPITAL_MANAGER", profilePictureUrl);
    }
}

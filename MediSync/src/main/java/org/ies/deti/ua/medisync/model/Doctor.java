package org.ies.deti.ua.medisync.model;

import java.util.List;

import jakarta.persistence.Entity;

@Entity
public class Doctor extends User {

    public Doctor() {}

    public Doctor(String username, String email, String password, String name, List<Patient> patientsAssigned, String profilePictureUrl) {
        super(username, email, password, name, "DOCTOR", profilePictureUrl);
        
    }

}

package org.ies.deti.ua.medisync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "hospital_manager")
public class HospitalManager extends User {

    public HospitalManager() {}

    public HospitalManager(String username, String email, String password, String name) {
        super(username, email, password,name);
    }
}

package org.ies.deti.ua.medisync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "hospital_manager")
public class HospitalManager extends User {

    public HospitalManager() {}

    public HospitalManager(String username, String email, String password, UserType userType, String name) {
        super(username, email, password, userType,name);
    }
}

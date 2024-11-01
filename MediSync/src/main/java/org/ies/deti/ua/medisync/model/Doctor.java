package org.ies.deti.ua.medisync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "doctor")
public class Doctor extends User {

    @OneToMany(mappedBy = "assignedDoctor")
    private List<Patient> patientsAssigned;

    // Constructors
    public Doctor() {}

    public Doctor(String username, String email, String password, UserType userType, String name, List<Patient> patientsAssigned) {
        super(username, email, password, userType, name);
        this.patientsAssigned = patientsAssigned;
    }

    public List<Patient> getPatientsAssigned() {
        return patientsAssigned;
    }

    public void setPatientsAssigned(List<Patient> patientsAssigned) {
        this.patientsAssigned = patientsAssigned;
    }
}

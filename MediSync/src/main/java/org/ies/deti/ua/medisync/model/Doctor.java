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

    public Doctor() {}

    public Doctor(String username, String email, String password, String name, List<Patient> patientsAssigned) {
        super(username, email, password, name);
        this.patientsAssigned = patientsAssigned;
    }

    public List<Patient> getPatientsAssigned() {
        return patientsAssigned;
    }

    public void setPatientsAssigned(List<Patient> patientsAssigned) {
        this.patientsAssigned = patientsAssigned;
    }
}

package org.ies.deti.ua.medisync.model;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "doctor")
public class Doctor {

    private String name;
    private List<Patient> patientsAssigned;

}

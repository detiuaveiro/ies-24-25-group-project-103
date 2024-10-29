package org.ies.deti.ua.medisync.model;


import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class MedicationAdministration {
    private Medication medication;
    private Long hour_interval;
    private Long dosageNumber;
}

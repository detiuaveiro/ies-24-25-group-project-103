package org.ies.deti.ua.medisync.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Medication {
    private String name;

    private Medication(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}

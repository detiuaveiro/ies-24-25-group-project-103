package org.ies.deti.ua.medisync.model;

// Easter egg: a mae do ricardo é uma badalhoca #NoCommitChallenge

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hospitalmanager")
public class HospitalManager {

    @Id
    private String id;

    private String name;
    
    
    //Constructors
    public HospitalManager(){}

    public HospitalManager(String name){
        this.name = name;
    }

    // Getters and Setters
    public String getName(){
        return name;
    }
    public void setName(String name){this.name = name;}

}

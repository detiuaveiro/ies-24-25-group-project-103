package org.ies.deti.ua.medisync.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "medicine")
public class Room {

    @Id
    private String id;
    private String roomNumber;           // E.g., "Room 101"

    @DBRef
    private List<Bed> beds;              // List of beds in the room

    // Constructor
    public Room() {}

    public Room(String roomNumber, List<Bed> beds) {
        this.roomNumber = roomNumber;
        this.beds = beds;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public List<Bed> getBeds() {
        return beds;
    }

    public void setBeds(List<Bed> beds) {
        this.beds = beds;
    }
}


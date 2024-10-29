package org.ies.deti.ua.medisync.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "medicine")
public class ScheduleEntry {

    private String timeSlot;          // E.g., "3pm-5pm"
    private boolean isInterval;       // True if this entry is an interval with no rooms
    @DBRef
    private List<Room> rooms;         // List of rooms assigned for this time slot

    // Constructors
    public ScheduleEntry(String timeSlot, boolean isInterval, List<Room> rooms) {
        this.timeSlot = timeSlot;
        this.isInterval = isInterval;
        this.rooms = isInterval ? new ArrayList<Room>() : rooms; // No rooms if interval
    }

    // Getters and Setters
    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public boolean isInterval() {
        return isInterval;
    }

    public void setInterval(boolean interval) {
        isInterval = interval;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }
}

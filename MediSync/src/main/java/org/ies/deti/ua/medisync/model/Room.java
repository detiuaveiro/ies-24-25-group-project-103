package org.ies.deti.ua.medisync.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {

    @Id
    @Column(name = "room_number", nullable = false, length = 10)
    private String roomNumber;

    @ManyToMany(mappedBy = "rooms")
    private Set<ScheduleEntry> scheduleEntries;

    @JsonManagedReference
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private Set<Bed> beds = new HashSet<>();

    public Room() {}

    public Room(String roomNumber, Set<ScheduleEntry> scheduleEntries, Set<Bed> beds) {
        this.roomNumber = roomNumber;
        this.scheduleEntries = scheduleEntries;
        this.beds = beds;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Set<ScheduleEntry> getScheduleEntries() {
        return scheduleEntries;
    }

    public void setScheduleEntries(Set<ScheduleEntry> scheduleEntries) {
        this.scheduleEntries = scheduleEntries;
    }

    public Set<Bed> getBeds() {
        return beds;
    }

    public void setBeds(Set<Bed> beds) {
        this.beds = beds;
    }


    @Override
    public String toString() {
        String result="";

        result+="Room number: "+roomNumber+"\n";
        result+="Beds: \n";
        for(Bed bed: beds){
            result+=bed.toString()+"\n";
        }

        return result;
    }
}

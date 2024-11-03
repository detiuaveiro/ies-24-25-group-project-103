package org.ies.deti.ua.medisync.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {

    @Id
    @Column(name = "room_number", nullable = false, length = 10)
    private String roomNumber;

    @ManyToMany
    @JoinTable(
            name = "schedule_rooms",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "room_id")
    )
    private Set<ScheduleEntry> scheduleEntries;


    public Room() {}

    public Room(String roomNumber, Set<ScheduleEntry> scheduleEntries) {
        this.roomNumber = roomNumber;
        this.scheduleEntries = scheduleEntries;
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

}

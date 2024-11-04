package org.ies.deti.ua.medisync.model;

import java.util.ArrayList;
import java.util.List;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

@Entity
@Table(name = "room")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, length = 10)
    private String roomNumber;

    @ManyToMany
    @JoinTable(
            name = "schedule_rooms",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "schedule_id")
    )
    @JsonManagedReference
    private List<ScheduleEntry> scheduleEntries;


    public Room() {}

    public Room(String roomNumber, List<ScheduleEntry> scheduleEntries) {
        this.roomNumber = roomNumber;
        this.scheduleEntries = scheduleEntries;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public List<ScheduleEntry> getScheduleEntries() {
        return scheduleEntries;
    }

    public void setScheduleEntries(List<ScheduleEntry> scheduleEntries) {
        this.scheduleEntries = scheduleEntries;
    }

}

package org.ies.deti.ua.medisync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import java.util.List;

@Entity
@Table(name = "room")
public class Room {

    @Id
    @Column(name = "room_number", nullable = false, length = 10)
    private String roomNumber;

    @OneToMany(mappedBy = "room")
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

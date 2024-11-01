package org.ies.deti.ua.medisync.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "schedule_entry")
public class ScheduleEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    @Column(name = "start_time", nullable = false)
    private Date start_time;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_time", nullable = false)
    private Date end_time;

    @Column(name = "is_interval", nullable = false)
    private boolean isInterval;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = true)
    private Room room;

    @ManyToMany
    @JoinTable(
        name = "schedule_nurse",
        joinColumns = @JoinColumn(name = "schedule_id"),
        inverseJoinColumns = @JoinColumn(name = "nurse_id")
    )
    private Set<Nurse> nurses = new HashSet<>();

    // Constructors
    public ScheduleEntry() {}

    public ScheduleEntry(String timeSlot, boolean isInterval, Room room, Date startTime, Date endTime) {
        this.start_time = startTime;
        this.end_time = endTime;
        this.isInterval = isInterval;
        this.room = room;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getStart_time() {
        return start_time;
    }
    public void setStart_time(Date start_time) {
        this.start_time = start_time;
    }
    public Date getEnd_time() {
        return end_time;
    }
    public void setEnd_time(Date end_time) {
        this.end_time = end_time;
    }
    public void setNurses(Set<Nurse> nurses) {
        this.nurses = nurses;
    }
    public Set<Nurse> getNurses() {
        return nurses;
    }

    public boolean isInterval() {
        return isInterval;
    }

    public void setInterval(boolean isInterval) {
        this.isInterval = isInterval;
    }


    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public void addNurse(Nurse nurse) {
        nurses.add(nurse);
        nurse.getSchedule().add(this);
    }

    public void removeNurse(Nurse nurse) {
        nurses.remove(nurse);
        nurse.getSchedule().remove(this);
    }
}

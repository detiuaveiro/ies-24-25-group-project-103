package org.ies.deti.ua.medisync.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "schedule_entry")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

    @ManyToMany(mappedBy = "scheduleEntries")
    private List<Room> rooms;

    @ManyToMany
    @JoinTable(
            name = "schedule_nurse",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "nurse_id")
    )
    private List<Nurse> nurses = new ArrayList<>();

    // Constructors
    public ScheduleEntry() {}

    public ScheduleEntry(String timeSlot, boolean isInterval, List<Room> rooms, Date startTime, Date endTime) {
        this.start_time = startTime;
        this.end_time = endTime;
        this.isInterval = isInterval;
        this.rooms = rooms;
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
    public void setNurses(List<Nurse> nurses) {
        this.nurses = nurses;
    }
    public List<Nurse> getNurses() {
        return nurses;
    }

    public boolean isInterval() {
        return isInterval;
    }

    public void setInterval(boolean isInterval) {
        this.isInterval = isInterval;
    }


    public List<Room> getRoom() {
        return rooms;
    }

    public void setRoom(List<Room> rooms) {
        this.rooms = rooms;
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

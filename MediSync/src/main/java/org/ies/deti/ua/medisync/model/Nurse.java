package org.ies.deti.ua.medisync.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "medicine")
public class Nurse {

    @Id
    private String id;
    private String name;
    private List<ScheduleEntry> schedule;

    public Nurse() {
        this.schedule = new ArrayList<ScheduleEntry>();
    }

    public Nurse(String name, List<ScheduleEntry> schedule) {
        this.name = name;
        this.schedule = schedule;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ScheduleEntry> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<ScheduleEntry> schedule) {
        this.schedule = schedule;
    }

    // Method to add a time slot or interval to the schedule
    public void addScheduleEntry(ScheduleEntry entry) {
        this.schedule.add(entry);
    }
}

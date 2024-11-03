
package org.ies.deti.ua.medisync.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bed")
public class Bed {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "room_number", nullable = false)
    private Room room;

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = true)
    private Patient assignedPatient;

    public Bed() {}

    public Bed(Long id, Room room, Patient assignedPatient) {
        this.id = id;
        this.room = room;
        this.assignedPatient = assignedPatient;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Patient getAssignedPatient() {
        return assignedPatient;
    }

    public void setAssignedPatient(Patient assignedPatient) {
        this.assignedPatient = assignedPatient;
    }


    @Override
    public String toString() {
        return "Bed " + id + " in room " + room.getRoomNumber();
    }
}

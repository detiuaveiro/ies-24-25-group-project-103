
package org.ies.deti.ua.medisync.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

@Entity
@Table(name = "bed")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @JsonManagedReference
    @OneToOne
    @JoinColumn(name = "patient_id", nullable = true)
    private Patient assignedPatient;

    public Bed() {}

    public Bed(Room room, Patient assignedPatient) {
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

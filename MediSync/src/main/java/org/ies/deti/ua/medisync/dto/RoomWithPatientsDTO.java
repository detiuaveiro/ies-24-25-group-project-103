package org.ies.deti.ua.medisync.dto;

import java.util.List;

public class RoomWithPatientsDTO {
    private Long roomId;
    private String roomNumber;
    private List<BedWithPatientDTO> beds;

    // Constructor
    public RoomWithPatientsDTO(Long roomId, String roomNumber, List<BedWithPatientDTO> beds) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.beds = beds;
    }

    // Getters and setters
    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public List<BedWithPatientDTO> getBeds() {
        return beds;
    }

    public void setBeds(List<BedWithPatientDTO> beds) {
        this.beds = beds;
    }
}

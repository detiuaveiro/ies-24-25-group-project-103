package org.ies.deti.ua.medisync.model;

public class RoomOccupancyDTO {
    private Long id;
    private String roomNumber;
    private int currentPatients;
    private final int maxPatients = 4;
    private int currentStaff;
    private final int maxStaff = 8;

    public RoomOccupancyDTO(Long id, String roomNumber, int currentPatients, int currentStaff) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.currentPatients = currentPatients;
        this.currentStaff = currentStaff;
    }

    public RoomOccupancyDTO() {
    }

    // Getters and setters
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

    public int getCurrentPatients() {
        return currentPatients;
    }

    public void setCurrentPatients(int currentPatients) {
        this.currentPatients = currentPatients;
    }

    public int getMaxPatients() {
        return maxPatients;
    }

    public int getCurrentStaff() {
        return currentStaff;
    }

    public void setCurrentStaff(int currentStaff) {
        this.currentStaff = currentStaff;
    }

    public int getMaxStaff() {
        return maxStaff;
    }
}
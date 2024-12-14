package org.ies.deti.ua.medisync.controller;

import org.ies.deti.ua.medisync.model.*;
import org.ies.deti.ua.medisync.service.HospitalManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hospital")
public class HospitalManagerController {

    private final HospitalManagerService hospitalManagerService;

    @Autowired
    public HospitalManagerController(HospitalManagerService hospitalManagerService) {
        this.hospitalManagerService = hospitalManagerService;
    }

    @PostMapping
    public ResponseEntity<HospitalManager> createHospitalManager() {
        HospitalManager createdHospitalManager = hospitalManagerService.createHospitalManager();
        return ResponseEntity.ok(createdHospitalManager);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteHospitalManager() {
        try {
            hospitalManagerService.deleteHospitalManager();
            return ResponseEntity.ok("Hospital Manager successfully removed\n");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error removing hospital manager: " + e.getMessage());
        }
    }

    // End points das salas

    @PostMapping("/rooms")
    public ResponseEntity<String> addRooms() {
        hospitalManagerService.addRooms();
        return ResponseEntity.status(HttpStatus.CREATED).body("Rooms added successfully\n");
    }

    @DeleteMapping("/rooms")
    public ResponseEntity<String> removeAllRooms() {
        try {
            hospitalManagerService.removeAllRooms();
            return ResponseEntity.ok("All rooms successfully removed\n");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error removing rooms: " + e.getMessage());
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = hospitalManagerService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        try {
            Room room = hospitalManagerService.getRoomById(id);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                               .body("Error getting room with id " + id + "\n" + e.getMessage());
        }
    }

    @GetMapping("/rooms/number/{roomNumber}")
    public ResponseEntity<?> getRoomByNumber(@PathVariable String roomNumber) {
        try {
            Room room = hospitalManagerService.getRoomByNumber(roomNumber);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                               .body("Room not found with number: " + roomNumber);
        }
    }

    @GetMapping("/beds")
    public ResponseEntity<List<Bed>> getBeds() {
        return ResponseEntity.ok(hospitalManagerService.getAllBeds());
    }

    @GetMapping("/rooms/occupants")
    public ResponseEntity<List<RoomOccupancyDTO>> getRoomsOccupancy() {
        List<RoomOccupancyDTO> occupancies = hospitalManagerService.getRoomsOccupancy();
        return ResponseEntity.ok(occupancies);
    }

}
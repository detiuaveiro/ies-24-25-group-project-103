package org.ies.deti.ua.medisync.service;

import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.ScheduleEntry;
import org.ies.deti.ua.medisync.repository.NurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NurseService {

    private final NurseRepository nurseRepository;

    @Autowired
    public NurseService(NurseRepository nurseRepository) {
        this.nurseRepository = nurseRepository;
    }

    public List<Nurse> getAllNurses() {
        return nurseRepository.findAll();
    }

    public Optional<Nurse> getNurseById(Long nurseId) {
        return nurseRepository.findById(nurseId);
    }

    public Nurse addScheduleEntryToNurse(Long nurseId, ScheduleEntry newEntry) {
        // Optional<Nurse>: To avoid the use of null and the problems it can cause (such as NullPointerException), Spring Data JPA and other Java libraries use the Optional class. An Optional is a container that can or cannot contain a value.
        // nurseOpt.isPresent(): This method checks if the Optional contains a value. If the Nurse was found, isPresent() returns true; otherwise, it returns false.
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            nurse.addScheduleEntry(newEntry);
            return nurseRepository.save(nurse);
        } else {
            return null;
        }
    }

    public Nurse removeScheduleEntryFromNurse(Long nurseId, Long entryId) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            nurse.getSchedule().removeIf(entry -> entry.getId().equals(entryId));
            return nurseRepository.save(nurse);
        } else {
            return null;
        }
    }

    public void deleteNurse(Long nurseId) {
        Nurse nurse = nurseRepository.findById(nurseId)
                .orElseThrow(() -> new RuntimeException("Nurse not found"));

        nurse.cleanupUnassociatedScheduleEntries();

        nurseRepository.delete(nurse);
    }
}
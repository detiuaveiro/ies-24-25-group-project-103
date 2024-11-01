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

    // Retorna todos os enfermeiros
    public List<Nurse> getAllNurses() {
        return nurseRepository.findAll();
    }

    // Busca um enfermeiro pelo ID
    public Optional<Nurse> getNurseById(Long nurseId) {
        return nurseRepository.findById(nurseId);
    }

    // Adiciona uma nova entrada de agendamento ao enfermeiro
    public Nurse addScheduleEntryToNurse(Long nurseId, ScheduleEntry newEntry) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            nurse.addScheduleEntry(newEntry);
            return nurseRepository.save(nurse);
        } else {
            throw new IllegalArgumentException("Nurse not found with ID: " + nurseId);
        }
    }

    // Remove uma entrada de agendamento de um enfermeiro
    public Nurse removeScheduleEntryFromNurse(Long nurseId, Long entryId) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            nurse.getSchedule().removeIf(entry -> entry.getId().equals(entryId));
            return nurseRepository.save(nurse);
        } else {
            throw new IllegalArgumentException("Nurse not found with ID: " + nurseId);
        }
    }

    // Deleta um enfermeiro pelo ID
    public void deleteNurse(Long nurseId) {
        nurseRepository.deleteById(nurseId);
    }
}
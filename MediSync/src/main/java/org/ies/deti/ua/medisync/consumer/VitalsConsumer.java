package org.ies.deti.ua.medisync.consumer;

import org.ies.deti.ua.medisync.model.VitalsBed;
import org.ies.deti.ua.medisync.service.PatientService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class VitalsConsumer {

    private final PatientService patientService;

    public VitalsConsumer(PatientService patientService) {
        this.patientService = patientService;
    }

    @KafkaListener(topics = "vitals", groupId = "vitals_group")
    public void consume(VitalsBed vitalsBed) {
        try {
            System.out.println("Consumed message: " + vitalsBed.toString());
            patientService.processAndWritePatientVitals(vitalsBed);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error consuming message: " + vitalsBed);
        }
    }
}

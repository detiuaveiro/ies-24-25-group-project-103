package org.ies.deti.ua.medisync.consumer;

import org.ies.deti.ua.medisync.model.VitalsBed;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class VitalsConsumer {

    private final ObjectMapper objectMapper;

    public VitalsConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "vitals", groupId = "vitals_group")
    public void consume(VitalsBed vitals) {
        
        try {
            System.out.println("Consumed message: " + vitals.toString());
        } catch (Exception e) {
            e.printStackTrace();

    }
}
}

package org.ies.deti.ua.medisync.service;

import java.util.Random;

import org.ies.deti.ua.medisync.model.Code;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.Visitor;
import org.ies.deti.ua.medisync.repository.CodeRepository;
import org.ies.deti.ua.medisync.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

import jakarta.annotation.PostConstruct;

@Service
public class VisitorService {

    private final PatientService patientService;
    private final CodeRepository codeRepository;
    private final VisitorRepository visitorRepository;

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.phoneNumber}")
    private String fromPhoneNumber;

    @Autowired
    public VisitorService(PatientService patientService, CodeRepository codeRepository, VisitorRepository visitorRepository) {
        this.patientService = patientService;
        this.codeRepository = codeRepository;
        this.visitorRepository = visitorRepository;
    }

    @PostConstruct
    private void initTwilio() {
        Twilio.init(accountSid, authToken);
    }



    public void sendSms(String to, String body) {
        Message.creator(
                new com.twilio.type.PhoneNumber(to),
                new com.twilio.type.PhoneNumber(fromPhoneNumber),
                body
        ).create();
    }

    public boolean checkIfVisitorIsAllowed(String name, String phoneNumber) {
        Visitor visitor = visitorRepository.findByPhoneNumber(phoneNumber);
        String patientName = visitor.getPatient().getName();
        if (patientName.equalsIgnoreCase(name) && visitor.getPhoneNumber().equals(phoneNumber)) {
            sendVisitorNotification(generateCode(visitor.getPatient(), phoneNumber), phoneNumber);
            return true;
        }
        return false;
    }

    public String generateCode(Patient patient, String phoneNumber) {
        Random random = new Random();
        String code = String.format("%06d", random.nextInt(1000000));
        Code newCode = new Code(code, phoneNumber, patient);
        codeRepository.save(newCode);
        return code;
    }

    private void sendVisitorNotification(String code, String phoneNumber) {
        String message = "Your visitor authentication code is: " + code;
        sendSms(phoneNumber, message);
    }

    public String verifyVisitorCode(String code) {
        Code foundCode = codeRepository.findByCode(code);
        if (foundCode != null) {
            return foundCode.getPatient().getBed().toString();
        }
        return null;
    }
}
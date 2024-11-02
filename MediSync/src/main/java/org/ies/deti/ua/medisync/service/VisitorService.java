package org.ies.deti.ua.medisync.service;

import java.util.List;
import java.util.Random;

import org.ies.deti.ua.medisync.model.Code;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.repository.CodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

@Service
public class VisitorService {

    private final PatientService patientService;
    private final CodeRepository codeRepository;

    @Autowired
    public VisitorService(PatientService patientService, TwilioService twilioService, CodeRepository codeRepository) {
        this.patientService = patientService;
        this.codeRepository = codeRepository;
        Twilio.init(accountSid, authToken);
    }

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.phoneNumber}")
    private String fromPhoneNumber;

    public void sendSms(String to, String body) {
        Message.creator(
                new com.twilio.type.PhoneNumber(to),
                new com.twilio.type.PhoneNumber(fromPhoneNumber),
                body
        ).create();
    }

    public boolean checkIfVisitorIsAllowed(String name, String phoneNumber) {
        List<Patient> patients = patientService.getAllPatients();
        for (Patient patient : patients) {
            for (String phoneNumbers : patient.getPhoneNumbers()) {
                if (phoneNumbers.equals(phoneNumber) && patient.getName().equals(name)) {
                    String code = String.format("%06d", new Random().nextInt(1_000_000));
                    codeRepository.save(new Code(code, phoneNumber, patient));    
                    sendVisitorNotification(code, phoneNumber);                
                    return true;
                }
            }
        }
        return false;
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
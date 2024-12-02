package org.ies.deti.ua.medisync.service;

import java.util.List;
import java.util.Random;

import org.ies.deti.ua.medisync.model.Code;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.Visitor;
import org.ies.deti.ua.medisync.repository.CodeRepository;
import org.ies.deti.ua.medisync.repository.PatientRepository;
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
    private final PatientRepository patientRepository;

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.phoneNumber}")
    private String fromPhoneNumber;

    @Autowired
    public VisitorService(PatientService patientService, CodeRepository codeRepository, VisitorRepository visitorRepository, PatientRepository patientRepository) {
        this.patientService = patientService;
        this.codeRepository = codeRepository;
        this.visitorRepository = visitorRepository;
        this.patientRepository = patientRepository;

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
        
        if (visitor != null && visitor.getPatient() != null) {
            String patientName = visitor.getPatient().getName();
            
            if (visitor.getPhoneNumber().equals(phoneNumber)) {
                String generatedCode = generateCode(visitor.getPatient(), phoneNumber);
                return true;
            }
        }
        return false;
    }

    public String generateCode(Patient patient, String phoneNumber) {
        Random random = new Random();
        String code = String.format("%06d", random.nextInt(1000000));
        
        Code existingCode = codeRepository.findByPhoneNumber(phoneNumber)
            .stream()
            .findFirst()
            .orElse(null);
            
        if (existingCode == null) {
            Code newCode = new Code(code, phoneNumber, patient);
            Code savedCode = codeRepository.save(newCode);
        } else {
            existingCode.setCode(code);
            Code savedCode = codeRepository.save(existingCode);
        }
        
        sendVisitorNotification(code, phoneNumber);
        return code;
    }

    private void sendVisitorNotification(String code, String phoneNumber) {
        String message = "Your visitor authentication code is: " + code;
        sendSms(phoneNumber, message);
    }

    public String verifyVisitorCode(String code, String phoneNumber) {
        Code foundCode = codeRepository.findByCodeAndPhoneNumber(code, phoneNumber);
        
        if (foundCode != null) {
            Patient patient = foundCode.getPatient();
            String bed = patientService.getPatientBed(patient).toString();
            return bed;
        }
        return null;
    }

    public Visitor addVisitor(Visitor visitor, Long id) {
        Patient patient = patientRepository.findPatientById(id);
        String phoneNumber = visitor.getPhoneNumber();
        Visitor existingVisitor = visitorRepository.findByPhoneNumber(phoneNumber);
        if (existingVisitor != null) {
            existingVisitor.setPatient(patient);
            return visitorRepository.save(existingVisitor);
        }
        else {
            visitor.setPatient(patient);
            return visitorRepository.save(visitor);
        }

    }

    public Visitor deleteVisitor(Long id) {
        Visitor visitor = visitorRepository.findVisitorById(id);
        visitorRepository.delete(visitor);
        return visitor;
    }
}
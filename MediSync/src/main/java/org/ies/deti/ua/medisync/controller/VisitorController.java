package org.ies.deti.ua.medisync.controller;

import org.ies.deti.ua.medisync.service.PatientService;
import org.ies.deti.ua.medisync.service.VisitorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/visitors")
public class VisitorController {
    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @PostMapping
    public ResponseEntity<String> checkIfVisitorIsAllowed(@RequestBody String name, @RequestBody String phoneNumber) {
        if (visitorService.checkIfVisitorIsAllowed(name,phoneNumber)) {
            return ResponseEntity.ok("Visitor allowed");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Visitor not allowed");
        }
    }

    @PostMapping("/checkcode")
    public ResponseEntity<String> checkCode(@RequestBody String code) {
        String bed = visitorService.verifyVisitorCode(code);
        if (bed == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Code not valid");
        }
        return ResponseEntity.ok(bed);
    }    
}

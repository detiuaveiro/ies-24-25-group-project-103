package org.ies.deti.ua.medisync.controller;

import org.ies.deti.ua.medisync.model.CodeVerification;
import org.ies.deti.ua.medisync.model.Visitor;
import org.ies.deti.ua.medisync.model.VisitorDTO;
import org.ies.deti.ua.medisync.service.VisitorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<String> checkIfVisitorIsAllowed(@RequestBody VisitorDTO visitorDTO) {
        String name = visitorDTO.getName();
        String phoneNumber = visitorDTO.getPhoneNumber();
    
        if (visitorService.checkIfVisitorIsAllowed(name, phoneNumber)) {
            return ResponseEntity.ok("Visitor allowed");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Visitor not allowed");
        }
    }

    @PostMapping("/checkcode")
    public ResponseEntity<String> checkCode(@RequestBody CodeVerification code) {
        System.out.println(code.getCode());
        System.out.println(code.getPhoneNumber());
        String bed = visitorService.verifyVisitorCode(code.getCode(), code.getPhoneNumber());
        if (bed == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Code not valid");
        }
        return ResponseEntity.ok(bed);
    }    

    @PostMapping("/add/{id}")
    public ResponseEntity<Visitor> addVisitor( @RequestBody Visitor visitor, @PathVariable Long id) {
        return ResponseEntity.ok(visitorService.addVisitor(visitor, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisitor(@PathVariable Long id) {
        visitorService.deleteVisitor(id);
        return ResponseEntity.noContent().build();
    }

}

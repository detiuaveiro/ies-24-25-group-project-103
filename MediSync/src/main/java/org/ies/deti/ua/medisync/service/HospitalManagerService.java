package org.ies.deti.ua.medisync.service;


import org.ies.deti.ua.medisync.model.Room;
import org.ies.deti.ua.medisync.repository.HospitalManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalManagerService {

    @Autowired
    private HospitalManagerRepository hospitalManagerRepository;

    public HospitalManagerService(HospitalManagerRepository hospitalManagerRepository) {
        this.hospitalManagerRepository = hospitalManagerRepository;
    }

    //public List<Room>


}

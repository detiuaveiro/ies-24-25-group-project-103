package org.ies.deti.ua.medisync.repository;
import org.ies.deti.ua.medisync.model.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeRepository extends JpaRepository<Code, Long> {
    public Code findByCode(String code);
    public Code findByPatientId(Long patientId);
    public Code findByCodeAndPhoneNumber(String code, String phoneNumber);

}

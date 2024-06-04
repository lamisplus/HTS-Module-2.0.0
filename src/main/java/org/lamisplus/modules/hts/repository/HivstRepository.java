package org.lamisplus.modules.hts.repository;

import org.lamisplus.modules.hts.domain.entity.Hivst;
import org.lamisplus.modules.hts.domain.entity.HivstPerson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HivstRepository extends JpaRepository<Hivst, Long>{
    List<Hivst> findAllByPatientIdAndArchived(Long patientId, int archived);
    Optional<Hivst> findByIdAndArchived(Long id, int archived);

    @Query(value = "SELECT hst.client_code as clientCode, p.id as personId, p.first_name as firstName, p.surname as surname, p.other_name as otherName, " +
            "p.hospital_number as hospitalNumber, CAST (EXTRACT(YEAR from AGE(NOW(),  date_of_birth)) AS INTEGER) as age, " +
            "INITCAP(p.sex) as gender, p.date_of_birth as dateOfBirth, CAST (COUNT(hst.patient_id) AS INTEGER) as hivstCount FROM patient_person p " +
            "INNER JOIN hivst hst ON hst.patient_id = p.id AND hst.archived = ?1 " +
            "WHERE p.archived=?1 AND p.facility_id=?2 " +
            "GROUP BY hst.client_code, p.id, p.first_name, p.first_name, p.surname, p.other_name, p.hospital_number, p.date_of_birth", nativeQuery = true)
    Page<HivstPerson> findAllPersonHivst(Integer archived, Long facilityId, Pageable pageable);


    @Query(value = "SELECT hst.client_code as clientCode, p.id as personId, p.first_name as firstName, p.surname as surname, p.other_name as otherName, " +
            "p.hospital_number as hospitalNumber, CAST (EXTRACT(YEAR from AGE(NOW(),  date_of_birth)) AS INTEGER) as age, " +
            "INITCAP(p.sex) as gender, p.date_of_birth as dateOfBirth, CAST (COUNT(hst.patient_id) AS INTEGER) as hivstCount " +
            "FROM patient_person p " +
            "INNER JOIN hivst hst ON hst.patient_id = p.id AND hst.archived = ?1 " +
            "WHERE p.archived=?1 AND p.facility_id=?2 AND (p.first_name ILIKE ?3 " +
            "OR p.surname ILIKE ?3 OR p.other_name ILIKE ?3 " +
            "OR p.hospital_number ILIKE ?3 OR hst.client_code ILIKE ?3) " +
            "GROUP BY hst.client_code, p.id, p.first_name, p.first_name, p.surname, p.other_name, p.hospital_number, p.date_of_birth", nativeQuery = true)
    Page<HivstPerson> findAllPersonHivstBySearchParam(Integer archived, Long facilityId, String search, Pageable pageable);
}

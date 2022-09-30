package org.lamisplus.modules.hts.repository;

import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HtsClientRepository extends JpaRepository<HtsClient, Long> {
    List<HtsClient> findAllByPerson(Person person);
    List<HtsClient> findAllByPersonOrderByIdDesc(Person person);
    Page<HtsClient> findAll(Pageable pageable);
    Optional<HtsClient> findByUuid(String uuid);
    @Query(value = "SELECT max(id) FROM hts_client", nativeQuery = true)
    Optional<Long> maxId();

    Optional<HtsClient> findByIdAndArchived(Long id, int archived);

    Optional<HtsClient> findByIdAndArchivedAndFacilityId(Long htsClientId, int archived, Long facilityId);

    List<HtsClient> findAllByClientCode(String code);
}
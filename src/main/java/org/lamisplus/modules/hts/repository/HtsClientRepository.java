package org.lamisplus.modules.hts.repository;

import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HtsClientRepository extends JpaRepository<HtsClient, Long> {
    List<HtsClient> findByPerson(Person person);

    Page<HtsClient> findAll(Pageable pageable);

}
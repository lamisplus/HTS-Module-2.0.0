package org.lamisplus.modules.hts.repository;

import org.lamisplus.modules.hts.domain.entity.Hivst;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HivstRepository extends JpaRepository<Hivst, Long>{
    List<Hivst> findAllByPatientIdAndArchived(Long patientId, int archived);
    Optional<Hivst> findByIdAndArchived(Long id, int archived);
}

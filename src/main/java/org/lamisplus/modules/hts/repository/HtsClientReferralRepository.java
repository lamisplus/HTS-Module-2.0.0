package org.lamisplus.modules.hts.repository;

import org.lamisplus.modules.hts.domain.entity.HtsClientReferral;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HtsClientReferralRepository extends JpaRepository<HtsClientReferral, Long> {

    Optional<HtsClientReferral> findByHtsClientId(Long htsClientId);
}

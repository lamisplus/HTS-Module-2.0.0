package org.lamisplus.modules.hts.repository;

import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HtsClientRepository extends JpaRepository<HtsClient, Long> {
}
package org.lamisplus.modules.hts.service;

import org.lamisplus.modules.hts.domain.dto.HivstDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface HivstService {
    List<HivstDto> saveHivst(HivstDto hivstDto);

    HivstDto updateHivst(HivstDto hivstDto, Long id);

    String deleteHivst(Long id);

    HivstDto getHivstById(Long id);

    List<HivstDto> getAllHivstByPatientId(Long patientId);
}

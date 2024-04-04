package org.lamisplus.modules.hts.service;

import org.lamisplus.modules.hts.domain.dto.PersonalNotificationServiceRequestDTO;
import org.lamisplus.modules.hts.domain.dto.PersonalNotificationServiceResponseDTO;

public interface PNSService {

  PersonalNotificationServiceResponseDTO save(PersonalNotificationServiceRequestDTO req);

  PersonalNotificationServiceResponseDTO update(PersonalNotificationServiceRequestDTO req);

}

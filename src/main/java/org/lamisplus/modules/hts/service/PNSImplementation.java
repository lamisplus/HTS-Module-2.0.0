package org.lamisplus.modules.hts.service;

import com.querydsl.core.util.BeanUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hts.domain.dto.PersonalNotificationServiceRequestDTO;
import org.lamisplus.modules.hts.domain.dto.PersonalNotificationServiceResponseDTO;
import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.hts.domain.entity.PersonalNotificationService;
import org.lamisplus.modules.hts.repository.HtsClientRepository;
import org.lamisplus.modules.hts.repository.PersonalNotificationServiceRepository;
import org.springframework.stereotype.Service;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@Service
@Slf4j
@RequiredArgsConstructor
public class PNSImplementation implements PNSService{

    private final HtsClientRepository htsClientRepository;
    private final PersonalNotificationServiceRepository personalNotificationServiceRepository;
    private final CurrentUserOrganizationService currentUserOrganizationService;


    @Override
    public PersonalNotificationServiceResponseDTO save(PersonalNotificationServiceRequestDTO req) {
        // GET THE HTS CLIENT ID
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        HtsClient htsClient = htsClientRepository
                .findByIdAndArchivedAndFacilityId(req.getHtsClientId(), UN_ARCHIVED, facilityId)
                .orElseThrow(()-> new EntityNotFoundException(HtsClient.class, "htsClientId", "" + req.getHtsClientId()));
        htsClient.setOfferedPns(req.getOfferedPns());
        htsClient.setAcceptedPns(req.getAcceptedPns());
        htsClientRepository.save(htsClient);
        PersonalNotificationServiceResponseDTO res = this.convertPnsRequestToResponseDto(req);
        res.setHtsClientUuid(htsClient.getUuid());

        // SAVE THE PERSONAL NOTIFICATION SERVICE


        return null;
    }

    @Override
    public PersonalNotificationServiceResponseDTO update(PersonalNotificationServiceRequestDTO req) {
        return null;
    }


    private PersonalNotificationServiceResponseDTO convertPnsRequestToResponseDto(PersonalNotificationServiceRequestDTO req) {
        PersonalNotificationServiceResponseDTO res = new PersonalNotificationServiceResponseDTO();
        res.setHtsClientId(req.getHtsClientId());
        res.setAddress(req.getAddress());
        res.setAcceptedHts(req.getAcceptedHts());
        res.setFirstName(req.getFirstName());
        res.setLastName(req.getLastName());
        res.setMiddleName(req.getMiddleName());
        res.setPhoneNumber(req.getPhoneNumber());
        res.setDatePartnerTested(req.getDatePartnerTested());
        res.setDateEnrollmentOnART(req.getDateEnrollmentOnART());
        res.setKnownHivPositive(req.getKnownHivPositive());
        res.setDob(req.getDob());
        res.setSex(req.getSex());
        res.setRelationshipToIndexClient(req.getRelationshipToIndexClient());
        res.setHivTestResult(req.getHivTestResult());
        res.setContactTracing(req.getContactTracing());
        res.setIntermediatePartnerViolence(req.getIntermediatePartnerViolence());






        return res;
    }


}

package org.lamisplus.modules.hts.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.hts.domain.dto.IndexElicitationDto;
import org.lamisplus.modules.hts.domain.dto.IndexElicitationResponseDto;
import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.hts.domain.entity.IndexElicitation;
import org.lamisplus.modules.hts.repository.HtsClientRepository;
import org.lamisplus.modules.hts.repository.IndexElicitationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.ARCHIVED;
import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@Service
@Slf4j
@RequiredArgsConstructor
public class IndexElicitationService {
    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final IndexElicitationRepository indexElicitationRepository;
    private final HtsClientRepository htsClientRepository;



    public List<IndexElicitationResponseDto> getAllByHtsClientId(Long htsClientId){
        HtsClient htsClient = htsClientRepository
                .findByIdAndArchivedAndFacilityId(htsClientId, UN_ARCHIVED, currentUserOrganizationService.getCurrentUserOrganization())
                .orElseThrow(()-> new EntityNotFoundException(HtsClient.class, "htsClientId", "" + htsClientId));

        return this.convertToIndexElicitationResponseDtos(indexElicitationRepository
                .findAllByHtsClient(htsClient));
    }

    public IndexElicitation save(IndexElicitationDto indexElicitationDto){
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        HtsClient htsClient = htsClientRepository.findByIdAndArchivedAndFacilityId(indexElicitationDto.getHtsClientId(), UN_ARCHIVED, facilityId)
                .orElseThrow(()-> new EntityNotFoundException(HtsClient.class, "htsClientId", "" + indexElicitationDto.getHtsClientId()));

        LOG.info("facilityId is {}", facilityId);
        LOG.info("indexElicitationDto is {}", indexElicitationDto);

        IndexElicitation indexElicitation = this.convertToIndexElicitation(indexElicitationDto);
        indexElicitation.setFacilityId(facilityId);
        indexElicitation.setHtsClientUuid(htsClient.getUuid());
        indexElicitation = indexElicitationRepository.save(indexElicitation);
        LOG.info("indexElicitation is {}", indexElicitation);


        //return this.convertToIndexElicitationResponseDto(indexElicitation);
        return indexElicitation;
    }

    public IndexElicitationResponseDto getIndexElicitationById(Long id) {
        return this.convertToIndexElicitationResponseDto(this.getById(id));
    }

    public IndexElicitationResponseDto update(Long id, IndexElicitationResponseDto indexElicitationResponseDto) {
        IndexElicitation indexElicitation = this.getById(id);
        if(indexElicitationResponseDto.getId().equals(indexElicitation.getId())) {
            throw new IllegalTypeException(IndexElicitation.class, "id", "does not match");
        }
        indexElicitation = this.convertToIndexElicitation(indexElicitationResponseDto, indexElicitation.getHtsClient());
        return this.convertToIndexElicitationResponseDto(indexElicitationRepository.save(indexElicitation));
    }

    public void delete(Long id) {
        IndexElicitation indexElicitation = this.getById(id);
        indexElicitation.setArchived(ARCHIVED);
        indexElicitationRepository.save(indexElicitation);
    }

    private List<IndexElicitationResponseDto> convertToIndexElicitationResponseDtos(List<IndexElicitation> indexElicitation) {
        if ( indexElicitation == null ) {
            return null;
        }

        List<IndexElicitationResponseDto> list = new ArrayList<>(indexElicitation.size());
        for ( IndexElicitation indexElicitation1 : indexElicitation) {
            if(indexElicitation1.getHtsClient() == null) throw new EntityNotFoundException(HtsClient.class, "HtsClient", "cannot be null");
            list.add( convertToIndexElicitationResponseDto(indexElicitation1) );
        }
        return list;
    }

    private IndexElicitation convertToIndexElicitation(IndexElicitationDto indexElicitationDto) {
        if ( indexElicitationDto == null ) {
            return null;
        }

        IndexElicitation indexElicitation = new IndexElicitation();

        try {
            indexElicitation.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
            indexElicitation.setDob(indexElicitationDto.getDob());
            indexElicitation.setIsDateOfBirthEstimated(indexElicitationDto.getIsDateOfBirthEstimated());
            indexElicitation.setSex(indexElicitationDto.getSex());
            indexElicitation.setAddress(indexElicitationDto.getAddress());
            indexElicitation.setLastName(indexElicitationDto.getLastName());
            indexElicitation.setFirstName(indexElicitationDto.getFirstName());
            indexElicitation.setMiddleName(indexElicitationDto.getMiddleName());
            indexElicitation.setPhoneNumber(indexElicitationDto.getPhoneNumber());
            indexElicitation.setAltPhoneNumber(indexElicitationDto.getAltPhoneNumber());
            indexElicitation.setHangOutSpots(indexElicitationDto.getHangOutSpots());
            indexElicitation.setPhysicalHurt(indexElicitationDto.getPhysicalHurt());
            indexElicitation.setThreatenToHurt(indexElicitationDto.getThreatenToHurt());
            indexElicitation.setNotificationMethod(indexElicitationDto.getNotificationMethod());
            indexElicitation.setPartnerTestedPositive(indexElicitationDto.getPartnerTestedPositive());
            indexElicitation.setRelativeToIndexClient(indexElicitationDto.getRelativeToIndexClient());
            indexElicitation.setSexuallyUncomfortable(indexElicitationDto.getSexuallyUncomfortable());
            indexElicitation.setCurrentlyLiveWithPartner(indexElicitationDto.getCurrentlyLiveWithPartner());
            indexElicitation.setDatePartnerCameForTesting(indexElicitationDto.getDatePartnerCameForTesting());
        }catch(Exception e){
            e.printStackTrace();
        }

        return indexElicitation;
    }

    private IndexElicitation convertToIndexElicitation(IndexElicitationResponseDto indexElicitationResponseDto, HtsClient htsClient) {
        if ( indexElicitationResponseDto == null ) {
            return null;
        }

        IndexElicitation indexElicitation = new IndexElicitation();

        indexElicitation.setHtsClient(htsClient);
        indexElicitation.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
        indexElicitation.setId(indexElicitation.getId());
        indexElicitation.setDob( indexElicitationResponseDto.getDob() );
        indexElicitation.setIsDateOfBirthEstimated( indexElicitationResponseDto.getIsDateOfBirthEstimated() );
        indexElicitation.setSex( indexElicitationResponseDto.getSex() );
        indexElicitation.setAddress( indexElicitationResponseDto.getAddress() );
        indexElicitation.setLastName( indexElicitationResponseDto.getLastName() );
        indexElicitation.setFirstName( indexElicitationResponseDto.getFirstName() );
        indexElicitation.setMiddleName( indexElicitationResponseDto.getMiddleName() );
        indexElicitation.setPhoneNumber( indexElicitationResponseDto.getPhoneNumber() );
        indexElicitation.setAltPhoneNumber( indexElicitationResponseDto.getAltPhoneNumber() );
        indexElicitation.setHangOutSpots( indexElicitationResponseDto.getHangOutSpots() );
        indexElicitation.setPhysicalHurt( indexElicitationResponseDto.getPhysicalHurt() );
        indexElicitation.setThreatenToHurt( indexElicitationResponseDto.getThreatenToHurt() );
        indexElicitation.setNotificationMethod( indexElicitationResponseDto.getNotificationMethod() );
        indexElicitation.setPartnerTestedPositive( indexElicitationResponseDto.getPartnerTestedPositive() );
        indexElicitation.setRelativeToIndexClient( indexElicitationResponseDto.getRelativeToIndexClient() );
        indexElicitation.setSexuallyUncomfortable( indexElicitationResponseDto.getSexuallyUncomfortable() );
        indexElicitation.setCurrentlyLiveWithPartner( indexElicitationResponseDto.getCurrentlyLiveWithPartner() );
        indexElicitation.setDatePartnerCameForTesting( indexElicitationResponseDto.getDatePartnerCameForTesting() );

        return indexElicitation;
    }

    private IndexElicitationResponseDto convertToIndexElicitationResponseDto(IndexElicitation indexElicitation) {
        if ( indexElicitation == null ) {
            return null;
        }

        IndexElicitationResponseDto indexElicitationResponseDto = new IndexElicitationResponseDto();

        indexElicitationResponseDto.setHtsClientId(indexElicitation.getHtsClient().getId());
        indexElicitationResponseDto.setId(indexElicitation.getId());
        indexElicitationResponseDto.setDob( indexElicitation.getDob() );
        indexElicitationResponseDto.setIsDateOfBirthEstimated( indexElicitation.getIsDateOfBirthEstimated() );
        indexElicitationResponseDto.setSex( indexElicitation.getSex() );
        indexElicitationResponseDto.setAddress( indexElicitation.getAddress() );
        indexElicitationResponseDto.setLastName( indexElicitation.getLastName() );
        indexElicitationResponseDto.setFirstName( indexElicitation.getFirstName() );
        indexElicitationResponseDto.setMiddleName( indexElicitation.getMiddleName() );
        indexElicitationResponseDto.setPhoneNumber( indexElicitation.getPhoneNumber() );
        indexElicitationResponseDto.setAltPhoneNumber( indexElicitation.getAltPhoneNumber() );
        indexElicitationResponseDto.setHangOutSpots( indexElicitation.getHangOutSpots() );
        indexElicitationResponseDto.setPhysicalHurt( indexElicitation.getPhysicalHurt() );
        indexElicitationResponseDto.setThreatenToHurt( indexElicitation.getThreatenToHurt() );
        indexElicitationResponseDto.setNotificationMethod( indexElicitation.getNotificationMethod() );
        indexElicitationResponseDto.setPartnerTestedPositive( indexElicitation.getPartnerTestedPositive() );
        indexElicitationResponseDto.setRelativeToIndexClient( indexElicitation.getRelativeToIndexClient() );
        indexElicitationResponseDto.setSexuallyUncomfortable( indexElicitation.getSexuallyUncomfortable() );
        indexElicitationResponseDto.setCurrentlyLiveWithPartner( indexElicitation.getCurrentlyLiveWithPartner() );
        indexElicitationResponseDto.setDatePartnerCameForTesting( indexElicitation.getDatePartnerCameForTesting() );

        return indexElicitationResponseDto;
    }

    private IndexElicitation getById(Long id){
        return indexElicitationRepository
                .findByIdAndArchivedAndFacilityId(id, UN_ARCHIVED, currentUserOrganizationService.getCurrentUserOrganization())
                .orElseThrow(()-> new EntityNotFoundException(IndexElicitation.class, "id", ""+id));
    }

}

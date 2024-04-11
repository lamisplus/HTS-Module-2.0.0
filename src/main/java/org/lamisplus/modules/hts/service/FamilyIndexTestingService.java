package org.lamisplus.modules.hts.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hts.domain.dto.*;
import org.lamisplus.modules.hts.domain.entity.FamilyIndex;
import org.lamisplus.modules.hts.domain.entity.FamilyIndexTesting;
import org.lamisplus.modules.hts.domain.entity.FamilyTestingTracker;
import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.hts.repository.FamilyIndexRepository;
import org.lamisplus.modules.hts.repository.FamilyIndexTestingRepository;
import org.lamisplus.modules.hts.repository.FamilyTestingTrackerRepository;
import org.lamisplus.modules.hts.repository.HtsClientRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@RequiredArgsConstructor
@Slf4j
@Service
public class FamilyIndexTestingService {

    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final HtsClientService htsClientService;
    private final HtsClientRepository htsClientRepository;
    private final FamilyIndexTestingRepository familyIndexTestingRepository;
    private final FamilyIndexRepository familyIndexRepository;
    private final FamilyTestingTrackerRepository familyTestingTrackerRepository;

    public FamilyIndexTestingResponseDTO save(FamilyIndexTestingRequestDTO requestDTO) {
        if (requestDTO == null) {
            throw new IllegalArgumentException("FamilyIndexTesting Request cannot be null");
        }

        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        HtsClient htsClient = htsClientRepository
                .findByIdAndArchivedAndFacilityId(requestDTO.getHtsClientId(), UN_ARCHIVED, facilityId)
                .orElseThrow(() -> new EntityNotFoundException(HtsClient.class, "htsClientId", "" + requestDTO.getHtsClientId()));

        FamilyIndexTesting familyIndexTesting = convertFamilyIndexTestingRequestDTOToEntity(requestDTO, htsClient);
        familyIndexTesting = familyIndexTestingRepository.save(familyIndexTesting);
        // add family index
        if (requestDTO.getFamilyIndexRequestDto() != null && !requestDTO.getFamilyIndexRequestDto().isEmpty()) {
            addFamilyIndices(requestDTO.getFamilyIndexRequestDto(), familyIndexTesting);
        }
        // add family index tracker
        if (requestDTO.getFamilyTestingTrackerRequestDTO() != null && !requestDTO.getFamilyTestingTrackerRequestDTO().isEmpty()) {
            addFamilyTestingTrackers(requestDTO.getFamilyTestingTrackerRequestDTO(), familyIndexTesting);
        }
        return convertFamilyIndexTestingToResponseDTO(familyIndexTesting);
    }


    public FamilyIndexTestingResponseDTO getFamilyIndexTestingById(Long id) {
        FamilyIndexTesting familyIndexTesting = familyIndexTestingRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(FamilyIndexTesting.class, "id", id + ""));
        return convertFamilyIndexTestingToResponseDTO(familyIndexTesting);
    }


    public List<FamilyIndexTestingResponseDTO> getAllFamilyIndexTestingByHtsClient(Long id) {
        List<FamilyIndexTesting> familyIndexTestingList = familyIndexTestingRepository.findAllFamilyIndexTestingByHtsClientId(id, UN_ARCHIVED);
        if (familyIndexTestingList.isEmpty() || familyIndexTestingList == null) {
            return new ArrayList<>();
        }
        List<FamilyIndexTestingResponseDTO> familyIndexTestingResponseDTOList = new ArrayList<>();
        for (FamilyIndexTesting familyIndexTesting : familyIndexTestingList) {
            familyIndexTestingResponseDTOList.add(convertFamilyIndexTestingToResponseDTO(familyIndexTesting));
        }
        return familyIndexTestingResponseDTOList;
    }


    public FamilyIndexTestingResponseDTO update(Long id, FamilyIndexTestingRequestDTO reqDTO) {
        FamilyIndexTesting existingFamilyIndexTesting = familyIndexTestingRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(FamilyIndexTesting.class, "id", id + ""));

        try {
            if (existingFamilyIndexTesting != null) {
                // Update existing FamilyIndexTesting entity
                updateExistingFamilyIndexTesting(existingFamilyIndexTesting, reqDTO);
                familyIndexTestingRepository.save(existingFamilyIndexTesting);

                List<FamilyIndex> familyIndexList = new ArrayList<>();
                List<FamilyTestingTracker> familyIndexTrackerList = new ArrayList<>();
                if (reqDTO.getFamilyIndexRequestDto() != null && !reqDTO.getFamilyIndexRequestDto().isEmpty()) {
                    for (FamilyIndexRequestDto familyIndexReqDto : reqDTO.getFamilyIndexRequestDto()) {
                        FamilyIndex familyIndex = new FamilyIndex();
                        familyIndex.setFamilyRelationship(familyIndexReqDto.getFamilyRelationship());
                        familyIndex.setFamilyIndexHivStatus(familyIndexReqDto.getFamilyIndexHivStatus());
                        familyIndex.setChildNumber(familyIndexReqDto.getChildNumber());
                        familyIndex.setMotherDead(familyIndexReqDto.getMotherDead());
                        familyIndex.setYearMotherDead(familyIndexReqDto.getYearMotherDead());
                        familyIndex.setFamilyIndexTesting(existingFamilyIndexTesting);
                        familyIndex.setFamilyIndexTestingUuid(existingFamilyIndexTesting.getUuid());
                        familyIndexList.add(familyIndex);
                    }
                    // Save the list of FamilyIndex
                    familyIndexRepository.saveAll(familyIndexList);
                }
                if (reqDTO.getFamilyTestingTrackerRequestDTO() != null || !reqDTO.getFamilyTestingTrackerRequestDTO().isEmpty()) {
                    for (FamilyTestingTrackerRequestDTO familyTestingTrackerRequestDTO : reqDTO.getFamilyTestingTrackerRequestDTO()) {
                        FamilyTestingTracker familyTestingTracker = new FamilyTestingTracker();
                        familyTestingTracker.setFamilyIndexTesting(existingFamilyIndexTesting);
                        familyTestingTracker.setFamilyIndexTestingUuid(existingFamilyIndexTesting.getUuid());
                        familyTestingTracker.setScheduleVisitDate(familyTestingTrackerRequestDTO.getScheduleVisitDate());
                        familyTestingTracker.setFollowUpAppointmentLocation(familyTestingTrackerRequestDTO.getFollowUpAppointmentLocation());
                        familyTestingTracker.setDateVisit(familyTestingTrackerRequestDTO.getDateVisit());
                        familyTestingTracker.setKnownHivPositive(familyTestingTrackerRequestDTO.getKnownHivPositive());
                        familyTestingTracker.setHiveTestResult(familyTestingTrackerRequestDTO.getHiveTestResult());
                        familyTestingTracker.setDateTested(familyTestingTrackerRequestDTO.getDateTested());
                        familyTestingTracker.setAttempt(familyTestingTrackerRequestDTO.getAttempt());
                        familyTestingTracker.setDateEnrolledOnArt(familyTestingTrackerRequestDTO.getDateEnrolledOnArt());
                        familyTestingTracker.setDateEnrolledInOVC(familyTestingTrackerRequestDTO.getDateEnrolledInOVC());
                        familyTestingTracker.setOvcId(familyTestingTrackerRequestDTO.getOvcId());
                        familyTestingTracker.setFacilityId(familyTestingTrackerRequestDTO.getFacilityId());
                        familyTestingTracker.setPositionOfChildEnumerated(familyTestingTrackerRequestDTO.getPositionOfChildEnumerated());
                        familyTestingTracker.setTrackerSex(familyTestingTrackerRequestDTO.getTrackerSex());
                        familyTestingTracker.setTrackerAge(familyTestingTrackerRequestDTO.getTrackerAge());
                        familyTestingTracker.setFamilyIndexTesting(existingFamilyIndexTesting);
                        familyTestingTracker.setFamilyIndexTestingUuid(existingFamilyIndexTesting.getUuid());
                        familyIndexTrackerList.add(familyTestingTracker);
                    }
                    familyTestingTrackerRepository.saveAll(familyIndexTrackerList);
                }
                // Convert and return the response DTO
                return convertFamilyIndexTestingToResponseDTO(existingFamilyIndexTesting);
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Error updating Family Index Testing", e);
        }
    }

    private FamilyIndexTestingResponseDTO convertFamilyIndexTestingToResponseDTO(FamilyIndexTesting familyIndexTesting) {
        FamilyIndexTestingResponseDTO responseDTO = new FamilyIndexTestingResponseDTO();
        responseDTO.setId(familyIndexTesting.getId());
        responseDTO.setUuid(familyIndexTesting.getUuid());
        responseDTO.setHtsClientId(familyIndexTesting.getHtsClient().getId());
        BeanUtils.copyProperties(familyIndexTesting, responseDTO);

        List<FamilyIndex> familyIndexList = new ArrayList<>();
        if (familyIndexTesting.getFamilyIndices() != null || !familyIndexTesting.getFamilyIndices().isEmpty()) {
            for (FamilyIndex familyIndex : familyIndexTesting.getFamilyIndices()) {
                FamilyIndex newFam = new FamilyIndex();
                newFam.setFamilyRelationship(familyIndex.getFamilyRelationship());
                newFam.setFamilyIndexHivStatus(familyIndex.getFamilyIndexHivStatus());
                newFam.setChildNumber(familyIndex.getChildNumber());
                newFam.setMotherDead(familyIndex.getMotherDead());
                newFam.setYearMotherDead(familyIndex.getYearMotherDead());
                newFam.setFamilyIndexTestingUuid(familyIndexTesting.getUuid());
                familyIndexList.add(newFam);
            }
            responseDTO.setFamilyIndexList(familyIndexList);
        }
        if (familyIndexTesting.getFamilyTestingTrackers() != null || !familyIndexTesting.getFamilyTestingTrackers().isEmpty()) {
            List<FamilyTestingTrackerResponseDTO> familyTestingTrackerResponseDTOList = new ArrayList<>();
            for (FamilyTestingTracker familyTestingTracker : familyIndexTesting.getFamilyTestingTrackers()) {
                familyTestingTrackerResponseDTOList.add(convertFamilyTestingTrackerToResponseDTO(familyTestingTracker));
            }
            responseDTO.setFamilyTestingTrackerResponseDTO(familyTestingTrackerResponseDTOList);
        }
        return responseDTO;
    }


    private void updateExistingFamilyIndexTesting(FamilyIndexTesting existingFamilyIndexTesting, FamilyIndexTestingRequestDTO reqDTO) {
        // Update existingFamilyIndexTesting properties
        existingFamilyIndexTesting.setState(reqDTO.getState());
        existingFamilyIndexTesting.setIndexClientId(existingFamilyIndexTesting.getIndexClientId());
        existingFamilyIndexTesting.setHtsClient(existingFamilyIndexTesting.getHtsClient());
        existingFamilyIndexTesting.setHtsClientUuid(existingFamilyIndexTesting.getHtsClientUuid());
        existingFamilyIndexTesting.setLga(reqDTO.getLga());
        existingFamilyIndexTesting.setFacilityName(reqDTO.getFacilityName());
        existingFamilyIndexTesting.setVisitDate(reqDTO.getVisitDate());
        existingFamilyIndexTesting.setSetting(reqDTO.getSetting());
        existingFamilyIndexTesting.setFamilyIndexClient(reqDTO.getFamilyIndexClient());
        existingFamilyIndexTesting.setSex(reqDTO.getSex());
        existingFamilyIndexTesting.setIndexClientId(existingFamilyIndexTesting.getIndexClientId());
        existingFamilyIndexTesting.setName(reqDTO.getName());
        existingFamilyIndexTesting.setDateOfBirth(reqDTO.getDateOfBirth());
        existingFamilyIndexTesting.setAge(reqDTO.getAge());
        existingFamilyIndexTesting.setMaritalStatus(reqDTO.getMaritalStatus());
        existingFamilyIndexTesting.setPhoneNumber(reqDTO.getPhoneNumber());
        existingFamilyIndexTesting.setAlternatePhoneNumber(reqDTO.getAlternatePhoneNumber());
        existingFamilyIndexTesting.setDateIndexClientConfirmedHivPositiveTestResult(reqDTO.getDateIndexClientConfirmedHivPositiveTestResult());
        existingFamilyIndexTesting.setVirallyUnSuppressed(reqDTO.getVirallyUnSuppressed());
        existingFamilyIndexTesting.setIsClientCurrentlyOnHivTreatment(reqDTO.getIsClientCurrentlyOnHivTreatment());
        existingFamilyIndexTesting.setDateClientEnrolledOnTreatment(reqDTO.getDateClientEnrolledOnTreatment());
        existingFamilyIndexTesting.setRecencyTesting(reqDTO.getRecencyTesting());
    }


    private FamilyIndexTesting convertFamilyIndexTestingRequestDTOToEntity(FamilyIndexTestingRequestDTO requestDTO, HtsClient htsClient) {
        FamilyIndexTesting familyIndexTesting = new FamilyIndexTesting();
        BeanUtils.copyProperties(requestDTO, familyIndexTesting);
        familyIndexTesting.setHtsClient(htsClient);
        familyIndexTesting.setHtsClientId(htsClient.getId());
        familyIndexTesting.setHtsClientUuid(htsClient.getUuid());
        return familyIndexTesting;
    }


    private void addFamilyIndices(List<FamilyIndexRequestDto> familyIndexRequestDtoList, FamilyIndexTesting familyIndexTesting) {
        for (FamilyIndexRequestDto familyIndexRequestDto : familyIndexRequestDtoList) {
            addFamilyIndex(familyIndexRequestDto, familyIndexTesting);
        }
    }

    private void addFamilyIndex(FamilyIndexRequestDto familyIndexRequestDto, FamilyIndexTesting familyIndexTesting) {
        if (familyIndexRequestDto == null) {
            throw new IllegalArgumentException("FamilyIndex Request cannot be null");
        }
        if (familyIndexTesting == null) {
            throw new IllegalArgumentException("FamilyIndexTesting cannot be null");
        }
        FamilyIndex familyIndex = new FamilyIndex();
        familyIndex.setFamilyRelationship(familyIndexRequestDto.getFamilyRelationship());
        familyIndex.setFamilyIndexHivStatus(familyIndexRequestDto.getFamilyIndexHivStatus());
        familyIndex.setChildNumber(familyIndexRequestDto.getChildNumber());
        familyIndex.setMotherDead(familyIndexRequestDto.getMotherDead());
        familyIndex.setYearMotherDead(familyIndexRequestDto.getYearMotherDead());
        familyIndex.setFamilyIndexTesting(familyIndexTesting);
        familyIndex.setFamilyIndexTestingUuid(familyIndexTesting.getUuid());
        familyIndexRepository.save(familyIndex);
    }

    public void addFamilyTestingTrackers(List<FamilyTestingTrackerRequestDTO> req, FamilyIndexTesting familyIndexTesting) {
        for (FamilyTestingTrackerRequestDTO familyTestingTrackerRequestDTO : req) {
            addFamilyIndexTracker(familyTestingTrackerRequestDTO, familyIndexTesting);
        }
    }

    public void addFamilyIndexTracker(FamilyTestingTrackerRequestDTO req, FamilyIndexTesting familyIndexTesting) {
        if (req != null && familyIndexTesting != null) {
            FamilyTestingTracker familyTestingTracker = new FamilyTestingTracker();
            familyTestingTracker.setFamilyIndexTesting(familyIndexTesting);
            familyTestingTracker.setFamilyIndexTestingUuid(familyIndexTesting.getUuid());
            familyTestingTracker.setScheduleVisitDate(req.getScheduleVisitDate());
            familyTestingTracker.setFollowUpAppointmentLocation(req.getFollowUpAppointmentLocation());
            familyTestingTracker.setDateVisit(req.getDateVisit());
            familyTestingTracker.setKnownHivPositive(req.getKnownHivPositive());
            familyTestingTracker.setHiveTestResult(req.getHiveTestResult());
            familyTestingTracker.setDateTested(req.getDateTested());
            familyTestingTracker.setAttempt(req.getAttempt());
            familyTestingTracker.setDateEnrolledOnArt(req.getDateEnrolledOnArt());
            familyTestingTracker.setDateEnrolledInOVC(req.getDateEnrolledInOVC());
            familyTestingTracker.setOvcId(req.getOvcId());
            familyTestingTracker.setFacilityId(req.getFacilityId());
            familyTestingTracker.setFamilyIndexTesting(familyIndexTesting);
            familyTestingTracker.setFamilyIndexTestingUuid(familyIndexTesting.getUuid());
            familyTestingTracker.setPositionOfChildEnumerated(req.getPositionOfChildEnumerated());
            familyTestingTracker.setTrackerSex(req.getTrackerSex());
            familyTestingTracker.setTrackerAge(req.getTrackerAge());

            familyTestingTrackerRepository.save(familyTestingTracker);
        } else {
            throw new IllegalArgumentException("Family Testing Tracker Request cannot be null");
        }
    }

    public String deleteFamilyIndexTestingById(Long id) {
        FamilyIndexTesting familyIndexTesting = familyIndexTestingRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(FamilyIndexTesting.class, "id", id + ""));
        familyIndexTesting.setArchived(1);
        familyIndexTestingRepository.save(familyIndexTesting);
        return "Family Index Testing with the id " + id + " deleted successfully";
    }

    public FamilyIndex findFamilyIndexById(Long id) {
        return familyIndexRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(FamilyIndex.class, "id", id.toString()));
    }

    public FamilyIndexResponseDTO getFamilyIndexById(Long id) {
        FamilyIndex familyIndex = findFamilyIndexById(id);
        return convertFamilyIndexToResponseDTO(familyIndex);
    }

    public List<FamilyIndexResponseDTO> getFamilyIndexByFamilyIndexTestingUuid(String uuid) {
        List<FamilyIndex> existingFamilyIndexList = familyIndexRepository.findByFamilyIndexTestingUuid(uuid, UN_ARCHIVED);
        if (existingFamilyIndexList.isEmpty() || existingFamilyIndexList == null) {
            return new ArrayList<>();
        }
        List<FamilyIndexResponseDTO> familyIndexResponseDTOList = new ArrayList<>();
        for (FamilyIndex familyIndex : existingFamilyIndexList) {
            familyIndexResponseDTOList.add(convertFamilyIndexToResponseDTO(familyIndex));
        }
        return familyIndexResponseDTOList;

    }

    private FamilyIndexResponseDTO convertFamilyIndexToResponseDTO(FamilyIndex familyIndex) {
        if (familyIndex == null) {
            throw new IllegalArgumentException("Family Index cannot be null");
        }
        FamilyIndexResponseDTO familyIndexResponseDTO = new FamilyIndexResponseDTO();
        familyIndexResponseDTO.setId(familyIndex.getId());
        familyIndexResponseDTO.setUuid(familyIndex.getUuid());
        familyIndexResponseDTO.setFamilyRelationship(familyIndex.getFamilyRelationship());
        familyIndexResponseDTO.setFamilyIndexHivStatus(familyIndex.getFamilyIndexHivStatus());
        familyIndexResponseDTO.setChildNumber(familyIndex.getChildNumber());
        familyIndexResponseDTO.setMotherDead(familyIndex.getMotherDead());
        familyIndexResponseDTO.setYearMotherDead(familyIndex.getYearMotherDead());
        return familyIndexResponseDTO;
    }

    public FamilyIndex updateFamilyIndex(Long id, FamilyIndexRequestDto familyIndexRequestDto) {
        FamilyIndex familyIndex = findFamilyIndexById(id);
        familyIndex.setFamilyRelationship(familyIndexRequestDto.getFamilyRelationship());
        familyIndex.setFamilyIndexHivStatus(familyIndexRequestDto.getFamilyIndexHivStatus());
        familyIndex.setChildNumber(familyIndexRequestDto.getChildNumber());
        familyIndex.setMotherDead(familyIndexRequestDto.getMotherDead());
        familyIndex.setYearMotherDead(familyIndexRequestDto.getYearMotherDead());
        return familyIndexRepository.save(familyIndex);
    }

    public String deleteFamilyIndex(Long id) {
        FamilyIndex familyIndex = findFamilyIndexById(id);
        familyIndex.setArchived(1);
        familyIndexRepository.save(familyIndex);
        return "Family Index with the id " + id + " deleted successfully";
    }

    public FamilyTestingTracker findFamilyTrackerById(Long id) {
        return familyTestingTrackerRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(FamilyTestingTracker.class, "id", id.toString()));

    }

    public FamilyTestingTrackerResponseDTO getFamilyTestingTrackerById(Long id) {
        FamilyTestingTracker familyTestingTracker = findFamilyTrackerById(id);
        return convertFamilyTestingTrackerToResponseDTO(familyTestingTracker);
    }

    public FamilyTestingTrackerResponseDTO updateFamilyTracker(Long id, FamilyTestingTrackerResponseDTO familyTestingTrackerRequestDTO) {
        FamilyTestingTracker familyTestingTracker = findFamilyTrackerById(id);
        if (familyTestingTracker == null) {
            throw new EntityNotFoundException(FamilyTestingTracker.class, "id", id.toString());
        }
        familyTestingTracker.setScheduleVisitDate(familyTestingTrackerRequestDTO.getScheduleVisitDate());
        familyTestingTracker.setFollowUpAppointmentLocation(familyTestingTrackerRequestDTO.getFollowUpAppointmentLocation());
        familyTestingTracker.setDateVisit(familyTestingTrackerRequestDTO.getDateVisit());
        familyTestingTracker.setKnownHivPositive(familyTestingTrackerRequestDTO.getKnownHivPositive());
        familyTestingTracker.setHiveTestResult(familyTestingTrackerRequestDTO.getHiveTestResult());
        familyTestingTracker.setDateTested(familyTestingTrackerRequestDTO.getDateTested());
        familyTestingTracker.setAttempt(familyTestingTrackerRequestDTO.getAttempt());
        familyTestingTracker.setDateEnrolledOnArt(familyTestingTrackerRequestDTO.getDateEnrolledOnArt());
        familyTestingTracker.setDateEnrolledInOVC(familyTestingTrackerRequestDTO.getDateEnrolledInOVC());
        familyTestingTracker.setOvcId(familyTestingTrackerRequestDTO.getOvcId());
        familyTestingTracker.setPositionOfChildEnumerated(familyTestingTrackerRequestDTO.getPositionOfChildEnumerated());
        familyTestingTracker.setTrackerSex(familyTestingTrackerRequestDTO.getTrackerSex());
        familyTestingTracker.setTrackerAge(familyTestingTrackerRequestDTO.getTrackerAge());
        familyTestingTrackerRepository.save(familyTestingTracker);

        return convertFamilyTestingTrackerToResponseDTO(familyTestingTracker);
    }

    public String deleteFamilyTracker(Long id) {
        FamilyTestingTracker familyTestingTracker = findFamilyTrackerById(id);
        familyTestingTracker.setArchived(1);
        familyTestingTrackerRepository.save(familyTestingTracker);
        return "Family Testing Tracker with the id " + id + " deleted successfully";
    }


    public List<FamilyTestingTrackerResponseDTO> getFamilyTestingTrackerByFamilyIndexTestingUuid(String uuid) {
        List<FamilyTestingTracker> familyTestingTrackerList = familyTestingTrackerRepository.findByFamilyIndexTestingUuid(uuid, UN_ARCHIVED);
        if (familyTestingTrackerList.isEmpty() || familyTestingTrackerList == null) {
            return new ArrayList<>();
        }
        List<FamilyTestingTrackerResponseDTO> familyTestingTrackerResponseDTOList = new ArrayList<>();
        for (FamilyTestingTracker familyTestingTracker : familyTestingTrackerList) {
            familyTestingTrackerResponseDTOList.add(convertFamilyTestingTrackerToResponseDTO(familyTestingTracker));
        }
        return familyTestingTrackerResponseDTOList;
    }

    private FamilyTestingTrackerResponseDTO convertFamilyTestingTrackerToResponseDTO(FamilyTestingTracker familyTestingTracker) {
        FamilyTestingTrackerResponseDTO familyTestingTrackerResponseDTO = new FamilyTestingTrackerResponseDTO();
        familyTestingTrackerResponseDTO.setId(familyTestingTracker.getId());
        familyTestingTrackerResponseDTO.setUuid(familyTestingTracker.getUuid());
        familyTestingTrackerResponseDTO.setScheduleVisitDate(familyTestingTracker.getScheduleVisitDate());
        familyTestingTrackerResponseDTO.setFollowUpAppointmentLocation(familyTestingTracker.getFollowUpAppointmentLocation());
        familyTestingTrackerResponseDTO.setDateVisit(familyTestingTracker.getDateVisit());
        familyTestingTrackerResponseDTO.setKnownHivPositive(familyTestingTracker.getKnownHivPositive());
        familyTestingTrackerResponseDTO.setHiveTestResult(familyTestingTracker.getHiveTestResult());
        familyTestingTrackerResponseDTO.setFamilyIndexTestingId(familyTestingTracker.getId());
        familyTestingTrackerResponseDTO.setFamilyIndexTestingUuid(familyTestingTracker.getFamilyIndexTestingUuid());
        familyTestingTrackerResponseDTO.setDateTested(familyTestingTracker.getDateTested());
        familyTestingTrackerResponseDTO.setAttempt(familyTestingTracker.getAttempt());
        familyTestingTrackerResponseDTO.setDateEnrolledOnArt(familyTestingTracker.getDateEnrolledOnArt());
        familyTestingTrackerResponseDTO.setDateEnrolledInOVC(familyTestingTracker.getDateEnrolledInOVC());
        familyTestingTrackerResponseDTO.setDateVisit(familyTestingTracker.getDateVisit());
        familyTestingTrackerResponseDTO.setOvcId(familyTestingTracker.getOvcId());
        familyTestingTrackerResponseDTO.setFacilityId(familyTestingTracker.getFacilityId());
        familyTestingTrackerResponseDTO.setPositionOfChildEnumerated(familyTestingTracker.getPositionOfChildEnumerated());
        familyTestingTrackerResponseDTO.setTrackerSex(familyTestingTracker.getTrackerSex());
        familyTestingTrackerResponseDTO.setTrackerAge(familyTestingTracker.getTrackerAge());
        return familyTestingTrackerResponseDTO;
    }

}

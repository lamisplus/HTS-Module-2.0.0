package org.lamisplus.modules.hts.service;


import io.micrometer.core.instrument.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@RequiredArgsConstructor
@Slf4j
@Service
public class FamilyIndexTestingService {

    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final HtsClientRepository htsClientRepository;
    private final FamilyIndexTestingRepository familyIndexTestingRepository;
    private final FamilyIndexRepository familyIndexRepository;
    private final FamilyTestingTrackerRepository familyTestingTrackerRepository;

    @Transactional
    public FamilyIndexTestingResponseDTO save(FamilyIndexTestingRequestDTO requestDTO) {
        if (requestDTO == null) {
            throw new IllegalArgumentException("FamilyIndexTesting Request cannot be null");
        }

        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        HtsClient htsClient = htsClientRepository
                .findByIdAndArchivedAndFacilityId(requestDTO.getHtsClientId(), UN_ARCHIVED, facilityId)
                .orElseThrow(() -> new EntityNotFoundException(HtsClient.class, "htsClientId", "" + requestDTO.getHtsClientId()));
//         check if htsClient id aleady exist exist
        Optional<FamilyIndexTesting> found = familyIndexTestingRepository.findByHtsClientIdAndArchived(requestDTO.getHtsClientId(), UN_ARCHIVED);
        if (found.isPresent()) {
            throw new IllegalArgumentException("Family Index Testing already exist for this client");
        }
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


    public FamilyIndexTestingResponseDTO getAllFamilyIndexTestingByHtsClient(Long id) {
        Optional<FamilyIndexTesting> familyIndexTestingList = familyIndexTestingRepository.findByHtsClientIdAndArchived(id, UN_ARCHIVED);
        if(!familyIndexTestingList.isPresent()) {
            throw new EntityNotFoundException(FamilyIndexTesting.class, "id", id + "");
        }
        return convertFamilyIndexTestingToResponseDTO2(familyIndexTestingList.get());
    }

    private FamilyIndexTestingResponseDTO convertFamilyIndexTestingToResponseDTO2(FamilyIndexTesting familyIndexTesting) {
        FamilyIndexTestingResponseDTO responseDTO = new FamilyIndexTestingResponseDTO();
        responseDTO.setId(familyIndexTesting.getId());
        responseDTO.setUuid(familyIndexTesting.getUuid());
        responseDTO.setHtsClientId(familyIndexTesting.getHtsClient().getId());
        BeanUtils.copyProperties(familyIndexTesting, responseDTO);

        List<FamilyIndexResponseDTO> familyIndexResponseDTOList = new ArrayList<>();
        if (familyIndexTesting.getFamilyIndices() != null && !familyIndexTesting.getFamilyIndices().isEmpty()) {
            for (FamilyIndex familyIndex : familyIndexTesting.getFamilyIndices()) {
                FamilyIndexResponseDTO newFam = new FamilyIndexResponseDTO();
                newFam.setId(familyIndex.getId());
                newFam.setUuid(familyIndex.getUuid());
                newFam.setFamilyRelationship(familyIndex.getFamilyRelationship());
                newFam.setFamilyIndexHivStatus(familyIndex.getFamilyIndexHivStatus());
                newFam.setChildNumber(familyIndex.getChildNumber());
                newFam.setMotherDead(familyIndex.getMotherDead());
                newFam.setYearMotherDead(familyIndex.getYearMotherDead());
                newFam.setUAN(familyIndex.getUAN());
                newFam.setFamilyIndexTestingUuid(familyIndexTesting.getUuid());
                familyIndexResponseDTOList.add(newFam);
            }
            responseDTO.setFamilyIndexList(familyIndexResponseDTOList);
        }

        List<FamilyTestingTrackerResponseDTO> familyTestingTrackerResponseDTOList = new ArrayList<>();
        if (familyIndexTesting.getFamilyTestingTrackers() != null && !familyIndexTesting.getFamilyTestingTrackers().isEmpty()) {
            for (FamilyTestingTracker familyTestingTracker : familyIndexTesting.getFamilyTestingTrackers()) {
                familyTestingTrackerResponseDTOList.add(convertFamilyTestingTrackerToResponseDTO(familyTestingTracker));
            }
        }
        responseDTO.setFamilyTestingTrackerResponseDTO(familyTestingTrackerResponseDTOList);

        return responseDTO;
    }

    @Transactional
    public String updateFamilyIndexTesting(Long htsClientId, FamilyIndexTestingResponseDTO reqDTO) {
        FamilyIndexTesting existingFamilyIndexTesting = familyIndexTestingRepository.findByHtsClientIdAndArchived(htsClientId, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(FamilyIndexTesting.class, "HtsClientId", htsClientId + ""));
        if (!Objects.equals(htsClientId, existingFamilyIndexTesting.getHtsClientId())) {
            throw new IllegalArgumentException("Mix match of hts client id");
        }
        updateEntityFields(reqDTO, existingFamilyIndexTesting);
        familyIndexTestingRepository.save(existingFamilyIndexTesting);

        updateFamilyIndices(reqDTO.getFamilyIndexList(), existingFamilyIndexTesting);
        updateFamilyTestingTrackers(reqDTO.getFamilyTestingTrackerResponseDTO(), existingFamilyIndexTesting);
        return "Family Index Testing updated successfully";
    }

    private void updateFamilyIndices(List<FamilyIndexResponseDTO> familyIndexList, FamilyIndexTesting existingFamilyIndexTesting) {
        if (familyIndexList != null && !familyIndexList.isEmpty()) {
            List<FamilyIndex> existingFamilyIndices = familyIndexRepository.findByFamilyIndexTestingUuid(existingFamilyIndexTesting.getUuid(), UN_ARCHIVED);
            Map<Long, FamilyIndexResponseDTO> familyIndexMap = familyIndexList.stream().collect(Collectors.toMap(FamilyIndexResponseDTO::getId, Function.identity()));
            // Iterate over existing family indices and update or delete them
            for (FamilyIndex familyIndex : existingFamilyIndices) {
                FamilyIndexResponseDTO familyIndexResponseDTO = familyIndexMap.get(familyIndex.getId());
                if (familyIndexResponseDTO == null) {
                    // Delete family index from the database if not found in the request
                    familyIndex.setArchived(1);
                    familyIndexRepository.save(familyIndex);
                } else {
                    // Update family index if found in the request
                    updateFamilyIndex(familyIndex, familyIndexResponseDTO);
                    familyIndexRepository.save(familyIndex);
                }
            }
            // Add new family indices
            for (FamilyIndexResponseDTO familyIndexResponseDTO : familyIndexList) {
                if (StringUtils.isEmpty(familyIndexResponseDTO.getFamilyIndexTestingUuid())) {
                    addFamilyIndex(familyIndexResponseDTO, existingFamilyIndexTesting);
                }
            }
        }
    }

    private void updateFamilyIndex(FamilyIndex familyIndex, FamilyIndexResponseDTO familyIndexResponseDTO) {
        BeanUtils.copyProperties(familyIndexResponseDTO, familyIndex);
    }

    private void addFamilyIndex(FamilyIndexResponseDTO familyIndexResponseDTO, FamilyIndexTesting existingFamilyIndexTesting) {
        // Create a new family index entity and save it
        FamilyIndex familyIndex = new FamilyIndex();
        familyIndex.setFamilyIndexTesting(existingFamilyIndexTesting);
        BeanUtils.copyProperties(familyIndexResponseDTO, familyIndex);
        familyIndex.setFamilyIndexTestingUuid(existingFamilyIndexTesting.getUuid());
        familyIndexRepository.save(familyIndex);
    }

    private void updateFamilyTestingTrackers(List<FamilyTestingTrackerResponseDTO> familyTestingTrackerResponseDTOList, FamilyIndexTesting existingFamilyIndexTesting) {
        if (familyTestingTrackerResponseDTOList != null && !familyTestingTrackerResponseDTOList.isEmpty()) {
            List<FamilyTestingTracker> existingTrackers = familyTestingTrackerRepository.findByFamilyIndexTestingUuid(existingFamilyIndexTesting.getUuid(), UN_ARCHIVED);
            Map<Long, FamilyTestingTrackerResponseDTO> trackerMap = familyTestingTrackerResponseDTOList.stream().collect(Collectors.toMap(FamilyTestingTrackerResponseDTO::getId, Function.identity()));

            // Iterate over existing family testing trackers and update or delete them
            for (FamilyTestingTracker tracker : existingTrackers) {
                FamilyTestingTrackerResponseDTO trackerResponseDTO = trackerMap.get(tracker.getId());
                if (trackerResponseDTO == null) {
                    // Delete tracker from the database if not found in the request
                    tracker.setArchived(1);
                    familyTestingTrackerRepository.save(tracker);
                } else {
                    // Update tracker if found in the request
                    updateFamilyTestingTracker(tracker, trackerResponseDTO);
                    familyTestingTrackerRepository.save(tracker);
                }
            }
            // Add new family testing trackers
            for (FamilyTestingTrackerResponseDTO trackerResponseDTO : familyTestingTrackerResponseDTOList) {
                if(StringUtils.isEmpty(trackerResponseDTO.getFamilyIndexTestingUuid())) {
                    addFamilyTestingTracker(trackerResponseDTO, existingFamilyIndexTesting);
                }
            }
        }
    }

    private void updateFamilyTestingTracker(FamilyTestingTracker tracker, FamilyTestingTrackerResponseDTO trackerResponseDTO) {
        BeanUtils.copyProperties(trackerResponseDTO, tracker);
    }

    private void addFamilyTestingTracker(FamilyTestingTrackerResponseDTO trackerResponseDTO, FamilyIndexTesting existingFamilyIndexTesting) {
        FamilyTestingTracker tracker = new FamilyTestingTracker();
        BeanUtils.copyProperties(trackerResponseDTO, tracker);
        tracker.setFacilityId(trackerResponseDTO.getFacilityId());
        tracker.setFamilyIndexTesting(existingFamilyIndexTesting);
        tracker.setFamilyIndexTestingUuid(existingFamilyIndexTesting.getUuid());
        familyTestingTrackerRepository.save(tracker);
    }

    private void updateEntityFields(FamilyIndexTestingResponseDTO reqDTO, FamilyIndexTesting entity) {
        // Update fields from DTO to entity
        entity.setHtsClientId(reqDTO.getHtsClientId());
        entity.setHtsClientUuid(reqDTO.getHtsClientUuid());
        entity.setExtra(reqDTO.getExtra());
        entity.setState(reqDTO.getState());
        entity.setLga(reqDTO.getLga());
        entity.setFacilityName(reqDTO.getFacilityName());
        entity.setVisitDate(reqDTO.getVisitDate());
        entity.setSetting(reqDTO.getSetting());
        entity.setFamilyIndexClient(reqDTO.getFamilyIndexClient());
        entity.setSex(reqDTO.getSex());
        entity.setIndexClientId(reqDTO.getIndexClientId());
        entity.setName(reqDTO.getName());
        entity.setDateOfBirth(reqDTO.getDateOfBirth());
        entity.setAge(reqDTO.getAge());
        entity.setMaritalStatus(reqDTO.getMaritalStatus());
        entity.setPhoneNumber(reqDTO.getPhoneNumber());
        entity.setAlternatePhoneNumber(reqDTO.getAlternatePhoneNumber());
        entity.setDateIndexClientConfirmedHivPositiveTestResult(reqDTO.getDateIndexClientConfirmedHivPositiveTestResult());
        entity.setVirallyUnSuppressed(reqDTO.getVirallyUnSuppressed());
        entity.setIsClientCurrentlyOnHivTreatment(reqDTO.getIsClientCurrentlyOnHivTreatment());
        entity.setDateClientEnrolledOnTreatment(reqDTO.getDateClientEnrolledOnTreatment());
        entity.setRecencyTesting(reqDTO.getRecencyTesting());
        entity.setWillingToHaveChildrenTestedElseWhere(reqDTO.getWillingToHaveChildrenTestedElseWhere());

    }

    private FamilyIndexTestingResponseDTO convertFamilyIndexTestingToResponseDTO(FamilyIndexTesting familyIndexTesting) {
        FamilyIndexTestingResponseDTO responseDTO = new FamilyIndexTestingResponseDTO();
        responseDTO.setId(familyIndexTesting.getId());
        responseDTO.setUuid(familyIndexTesting.getUuid());
        responseDTO.setHtsClientId(familyIndexTesting.getHtsClient().getId());
        BeanUtils.copyProperties(familyIndexTesting, responseDTO);

        List<FamilyIndexResponseDTO> familyIndexResponseDTOList = new ArrayList<>();
        if (familyIndexTesting.getFamilyIndices() != null || !familyIndexTesting.getFamilyIndices().isEmpty()) {
            for (FamilyIndex familyIndex : familyIndexTesting.getFamilyIndices()) {
                FamilyIndexResponseDTO newFam = getFamilyIndexResponseDTO(familyIndexTesting, familyIndex);
                familyIndexResponseDTOList.add(newFam);
            }
            responseDTO.setFamilyIndexList(familyIndexResponseDTOList);
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

    @NotNull
    private static FamilyIndexResponseDTO getFamilyIndexResponseDTO(FamilyIndexTesting familyIndexTesting, FamilyIndex familyIndex) {
        FamilyIndexResponseDTO newFam = new FamilyIndexResponseDTO();
        newFam.setId(familyIndex.getId());
        newFam.setUuid(familyIndex.getUuid());
        newFam.setFamilyRelationship(familyIndex.getFamilyRelationship());
        newFam.setFamilyIndexHivStatus(familyIndex.getFamilyIndexHivStatus());
        newFam.setChildNumber(familyIndex.getChildNumber());
        newFam.setMotherDead(familyIndex.getMotherDead());
        newFam.setYearMotherDead(familyIndex.getYearMotherDead());
        newFam.setUAN(familyIndex.getUAN());
        newFam.setFamilyIndexTestingUuid(familyIndexTesting.getUuid());
        return newFam;
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
        familyIndex.setUAN(familyIndexRequestDto.getUAN());
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
            BeanUtils.copyProperties(req, familyTestingTracker);
            familyTestingTracker.setFamilyIndexTesting(familyIndexTesting);
            familyTestingTracker.setFamilyIndexTestingUuid(familyIndexTesting.getUuid());

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
        if (existingFamilyIndexList.isEmpty()) {
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
        BeanUtils.copyProperties(familyIndex, familyIndexResponseDTO);
        return familyIndexResponseDTO;
    }

    public FamilyIndexResponseDTO updateFamilyIndex(Long id, FamilyIndexRequestDto familyIndexRequestDto) {
        FamilyIndex familyIndex = findFamilyIndexById(id);
        BeanUtils.copyProperties(familyIndexRequestDto, familyIndex);
        familyIndex.setFamilyIndexTestingUuid(familyIndex.getFamilyIndexTesting().getUuid());
        familyIndex.setFamilyIndexTesting(familyIndex.getFamilyIndexTesting());
        familyIndexRepository.save(familyIndex);
      return  convertFamilyIndexToResponseDTO(familyIndex);

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
        BeanUtils.copyProperties(familyTestingTrackerRequestDTO, familyTestingTracker);
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
        if (familyTestingTrackerList.isEmpty()) {
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
        BeanUtils.copyProperties(familyTestingTracker, familyTestingTrackerResponseDTO);
        familyTestingTrackerResponseDTO.setId(familyTestingTracker.getId());
        return familyTestingTrackerResponseDTO;
    }

}

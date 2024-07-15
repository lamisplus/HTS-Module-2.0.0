package org.lamisplus.modules.hts.service.serviceImpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.hts.domain.dto.HivstBasicUserInfoDto;
import org.lamisplus.modules.hts.domain.dto.HivstDto;
import org.lamisplus.modules.hts.domain.dto.HivstTestKitUserInfoDto;
import org.lamisplus.modules.hts.domain.entity.Hivst;
import org.lamisplus.modules.hts.domain.entity.HivstPerson;
import org.lamisplus.modules.hts.domain.entity.HtsPerson;
import org.lamisplus.modules.hts.repository.HivstRepository;
import org.lamisplus.modules.hts.service.CurrentUserOrganizationService;
import org.lamisplus.modules.hts.service.HivstService;
import org.lamisplus.modules.patient.domain.dto.PersonDto;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@Service
@RequiredArgsConstructor
@Slf4j
public class HivstServiceImpl implements HivstService {
    private final HivstRepository hivstRepository;
    private final PersonService personService;
    private final ObjectMapper objectMapper;
    private final CurrentUserOrganizationService currentUserOrganizationService;

    private final String MYSELF = "myself";
    private final int UN_ARCHIVED = 0;

    @Override
    public List<HivstDto> saveHivst(HivstDto hivstDto) {
        LOG.info("Validating HivstDto: {}", hivstDto.toString());
        validateHasPatient(hivstDto);
        validateTestKitUserCategories(hivstDto.getTestKitUserDetails(), hivstDto.getTestKitUsers());
//        validateTestKitsAccountedFor(hivstDto.getTestKitUserDetails().size(), hivstDto.getNumberOfHivstKitsReceived());

        LOG.info("Processing HivstDto");
        List<Hivst> processedHivstList = new ArrayList<>();
        if (hivstDto.getTestKitUserDetails().isEmpty()) {
            // create a raw HIVST
            Hivst hivst = Hivst.fromDto(hivstDto);
            hivst.setPatientId(getOrCreatePatientId(hivstDto));
            processedHivstList.add(hivst);
        } else {
            // process the hivst for primary and secondary patients
            processedHivstList.addAll(processHivstForPrimaryAndSecondaryPatients(hivstDto));
        }

        LOG.info("Saving Hivst");
        List<Hivst> savedHivst = hivstRepository.saveAll(processedHivstList);

        return savedHivst.stream().map(each -> {
            try {
                return HivstDto.fromEntity(each);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());
    }


    private List<Hivst> processHivstForPrimaryAndSecondaryPatients(HivstDto hivstDto) {
        Hivst myselfHivst = null;
        List<HivstTestKitUserInfoDto> updatedUserInfo = new ArrayList<>();
        List<Hivst> hivstList = new ArrayList<>();
        List<HivstTestKitUserInfoDto> listOfUserInfo = hivstDto.getTestKitUserDetails();
        for (HivstTestKitUserInfoDto userInfo : listOfUserInfo) {
            if (userInfo.getBasicUserInfo().getUserCategory().equalsIgnoreCase(MYSELF)) {
                Hivst hivst = Hivst.fromDto(hivstDto);
                hivst.setPatientId(getOrCreatePatientId(hivstDto));
                hivst.setPostTestAssessment(objectMapper.valueToTree(userInfo.getPostTestAssessment()));
                hivst.setReferralInformation(objectMapper.valueToTree(userInfo.getPostTestAssessment().getReferralInformation()));
//                hivst.setTestKitUserDetails(userInfo);
//                hivstList.add(hivst);
                updatedUserInfo.add(userInfo);
                myselfHivst = hivst;
            } else {
                PersonDto personDto = HivstBasicUserInfoDto.toPersonDto(userInfo.getBasicUserInfo());
                PersonResponseDto personResponseDto = personService.createPerson(personDto);
                Hivst hivst = Hivst.fromHivstTestKitUserInfoDtoAndHivstDto(userInfo, hivstDto);
                Long createdPatientId = personResponseDto.getId();
                hivst.setPatientId(createdPatientId);
                userInfo.getBasicUserInfo().setPatientId(createdPatientId);
                updatedUserInfo.add(userInfo);
//                hivst.setTestKitUserDetails(userInfo);
                hivstList.add(hivst);
            }


        }

        if (myselfHivst != null){
            myselfHivst.setTestKitUserDetails(objectMapper.valueToTree(updatedUserInfo));
            hivstList.add(myselfHivst);
        }

        return hivstList;
    }

    private List<Hivst> editHivstForPrimaryAndSecondaryPatients(HivstDto hivstDto) {
        Hivst myselfHivst = null;
        List<HivstTestKitUserInfoDto> updatedUserInfo = new ArrayList<>();
        // get the hivstDto
        // figure out which ones have patient Id
        // if they have patient Id, find the Hivst for that patient Id and date of visit

        List<Hivst> hivstList = new ArrayList<>();
        List<HivstTestKitUserInfoDto> listOfUserInfo = hivstDto.getTestKitUserDetails();
        for (HivstTestKitUserInfoDto userInfo : listOfUserInfo) {
            if (userInfo.getBasicUserInfo().getUserCategory().equalsIgnoreCase(MYSELF)) {
                // find my own hivst
                // update it and keep it in the myself object
                Optional<Hivst> myHivst = hivstRepository.findOneByPatientIdAndDateOfVisit(hivstDto.getPatientId(), hivstDto.getDateOfVisit());
                if (myHivst.isPresent()){
                    Hivst myFoundHivst = myHivst.get();
                    Hivst hivst = Hivst.fromDto(hivstDto);
                    hivst.setId(myFoundHivst.getId());
                    hivst.setPostTestAssessment(objectMapper.valueToTree(userInfo.getPostTestAssessment()));
                    hivst.setReferralInformation(objectMapper.valueToTree(userInfo.getPostTestAssessment().getReferralInformation()));
                    updatedUserInfo.add(userInfo);
                    myselfHivst = hivst;
                } else {
                    // create a new hivst
                    Hivst hivst = Hivst.fromDto(hivstDto);
                    hivst.setPatientId(getOrCreatePatientId(hivstDto));
                    hivst.setPostTestAssessment(objectMapper.valueToTree(userInfo.getPostTestAssessment()));
                    hivst.setReferralInformation(objectMapper.valueToTree(userInfo.getPostTestAssessment().getReferralInformation()));
                    updatedUserInfo.add(userInfo);
                    myselfHivst = hivst;
                }
            } else {
                // check if the userInfo has a patient Id
                // if it does, find that hivst by patient id and date of visit, and update it
                // if it does not, create a new patient and hivst
                if (userInfo.getBasicUserInfo().getPatientId() != null){
                    Optional<Hivst> thisHivst = hivstRepository.findOneByPatientIdAndDateOfVisit(hivstDto.getPatientId(), hivstDto.getDateOfVisit());
                    if (thisHivst.isPresent()){
                        Hivst foundHivst = thisHivst.get();
                        Hivst hivst = Hivst.fromHivstTestKitUserInfoDtoAndHivstDto(userInfo, hivstDto);
                        hivst.setId(foundHivst.getId());
                        hivstList.add(hivst);
                    } else {
                        createPatientAndHivst(hivstDto, updatedUserInfo, hivstList, userInfo);

                    }
                } else {
                    createPatientAndHivst(hivstDto, updatedUserInfo, hivstList, userInfo);
                }
            }

            if (myselfHivst != null){
                myselfHivst.setTestKitUserDetails(objectMapper.valueToTree(updatedUserInfo));
                hivstList.add(myselfHivst);
            }


        }
        return hivstList;
    }

    private void createPatientAndHivst(HivstDto hivstDto, List<HivstTestKitUserInfoDto> updatedUserInfo, List<Hivst> hivstList, HivstTestKitUserInfoDto userInfo) {
        PersonDto personDto = HivstBasicUserInfoDto.toPersonDto(userInfo.getBasicUserInfo());
        PersonResponseDto personResponseDto = personService.createPerson(personDto);
        Hivst hivst = Hivst.fromHivstTestKitUserInfoDtoAndHivstDto(userInfo, hivstDto);
        hivst.setPatientId(personResponseDto.getId());
        hivstList.add(hivst);
        Long createdPatientId = personResponseDto.getId();
        userInfo.getBasicUserInfo().setPatientId(createdPatientId);
        updatedUserInfo.add(userInfo);
    }

//    @Override
//    public HivstDto updateHivst(HivstDto hivstDto, Long id) {
//        LOG.info("Finding Hivst by id: {}", id);
//        Hivst hivst = hivstRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Hivst.class, "id", id.toString()));
//        try{
//            LOG.info("Found. Updating Hivst...");
//
//            Hivst hivstUpdate = Hivst.fromDto(hivstDto);
//            hivstUpdate.setId(id);
//            hivstUpdate.setTestKitUserDetails(hivst.getTestKitUserDetails());
//            hivstUpdate.setTestKitUsers(objectMapper.valueToTree(hivst.getTestKitUsers()));
//            hivstUpdate.setNumberOfHivstKitsReceived(hivst.getNumberOfHivstKitsReceived());
//            hivstUpdate.setOtherTestKitUserInfoAvailable(hivst.getOtherTestKitUserInfoAvailable());
//            hivstUpdate.setUserType(hivst.getUserType());
//
//            return HivstDto.fromEntity(hivstRepository.save(hivstUpdate));
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
//        }
//    }

    @Override
    public List<HivstDto> updateHivst(HivstDto hivstDto, Long id) {
        LOG.info("Finding Hivst by id: {}", id);
        Hivst hivst = hivstRepository.findByIdAndArchived(hivstDto.getId(), UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Hivst.class, "id", hivstDto.getId().toString()));
        LOG.info("Found. Updating Hivst...");

        Hivst hivstUpdate = Hivst.fromDto(hivstDto);
        List<Hivst> toBeUpdated = editHivstForPrimaryAndSecondaryPatients(hivstDto);
//            hivstUpdate.setTestKitUserDetails(hivst.getTestKitUserDetails());
//            hivstUpdate.setTestKitUsers(objectMapper.valueToTree(hivst.getTestKitUsers()));
//            hivstUpdate.setNumberOfHivstKitsReceived(hivst.getNumberOfHivstKitsReceived());
//            hivstUpdate.setOtherTestKitUserInfoAvailable(hivst.getOtherTestKitUserInfoAvailable());
//            hivstUpdate.setUserType(hivst.getUserType());
//            hivstUpdate.setArchived(0);

//            return HivstDto.fromEntity(hivstRepository.save(hivstUpdate));
        List<Hivst> savedHivst = hivstRepository.saveAll(toBeUpdated);

        return savedHivst.stream().map(each -> {
            try {
                return HivstDto.fromEntity(each);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());
    }

    @Override
    public String deleteHivst(Long id) {
        LOG.info("Deleting Hivst by id: {}" , id);
        Hivst hivst = hivstRepository.findByIdAndArchived(id, UN_ARCHIVED).orElse(null);
        if (hivst != null) {
            hivst.setArchived(1);
            hivstRepository.save(hivst);
            return "Hivst deleted successfully";
        } else {
            throw new EntityNotFoundException( Hivst.class, "id", id.toString());
        }
    }

    @Override
    public HivstDto getHivstById(Long id) {
        Hivst hivst = hivstRepository.findByIdAndArchived(id, UN_ARCHIVED).orElseThrow(() -> new EntityNotFoundException(Hivst.class, "id", id.toString()));
        try {
            return HivstDto.fromEntity(hivst);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<HivstDto> getAllHivstByPatientId(Long patientId) {
        List<Hivst> listOfHivst = hivstRepository.findAllByPatientIdAndArchived(patientId, UN_ARCHIVED);
            return listOfHivst.stream().map(hivst -> {
                try {
                    return HivstDto.fromEntity(hivst);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
    }

    @Override
    public Page<HivstPerson> getAllHivstPerson(String searchValue, int pageNo, int pageSize) {
        Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        //List<HtsPerson> htsPeople = new ArrayList<>();
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        if(!String.valueOf(searchValue).equals("null") && !searchValue.equals("*")){
            searchValue = searchValue.replaceAll("\\s", "");
            String queryParam = "%"+searchValue+"%";
            return hivstRepository
                    .findAllPersonHivstBySearchParam(UN_ARCHIVED, facilityId, queryParam, pageable);
        }
        return hivstRepository
                .findAllPersonHivst(UN_ARCHIVED, facilityId, pageable);
    }


    private Long getOrCreatePatientId(HivstDto hivstDto) {
        if (hivstDto.getPatientId() != null){
            return hivstDto.getPatientId();
        } else {
            PersonDto personDto = hivstDto.getPersonObject();
            PersonResponseDto personResponseDto = personService.createPerson(personDto);
            return personResponseDto.getId();
        }
    }

    private void validateHasPatient(HivstDto hivstDto){
        if (hivstDto.getPatientId() == null && hivstDto.getPersonObject() == null){
            throw new IllegalTypeException(HivstDto.class, "HIVST ", "does not contain a patient object.");
        }
    }

    private void validateTestKitUserCategories(List<HivstTestKitUserInfoDto> userInfoDtoList, List<String> testKitUsers){
        int countMyself = 0;
        for (int i = 0; i < userInfoDtoList.size(); i++) {
            HivstTestKitUserInfoDto userInfo = userInfoDtoList.get(i);
            if(!testKitUsers.contains(userInfo.getBasicUserInfo().getUserCategory())){
                throw new IllegalTypeException(HivstDto.class, "HIVST ", "selected test kit user categories unaccounted for.");
            }
        }


    }


    private void validateTestKitsAccountedFor(int numberInUserInfo, int numberOfHivstKitsReceived){
        if (numberInUserInfo > numberOfHivstKitsReceived){
            throw new IllegalTypeException(HivstDto.class, "numberOfHivstKitsReceived: ", "" + numberOfHivstKitsReceived + ".", " Number of test kits unaccounted for." );
        }
    }

}

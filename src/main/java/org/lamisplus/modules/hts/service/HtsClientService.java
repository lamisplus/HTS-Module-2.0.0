package org.lamisplus.modules.hts.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.hts.domain.dto.HtsClientDto;
import org.lamisplus.modules.hts.domain.dto.HtsClientRequestDto;
import org.lamisplus.modules.hts.domain.dto.HtsHivTestResultDto;
import org.lamisplus.modules.hts.domain.dto.HtsPreTestCounselingDto;
import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.hts.repository.HtsClientRepository;
import org.lamisplus.modules.patient.domain.dto.PersonDto;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;

@Service
@Slf4j
@RequiredArgsConstructor
public class HtsClientService {
    //private final HtsClientMapper htsClientMapper;
    private final HtsClientRepository htsClientRepository;
    private final PersonRepository personRepository;
    private final PersonService personService;
    private final CurrentUserOrganizationService currentUserOrganizationService;

    public HtsClientDto save(HtsClientRequestDto htsClientRequestDto){
        HtsClient htsClient;
        PersonResponseDto personResponseDto;
        //when it is a new person
        if(htsClientRequestDto.getPersonId() == null){
            if(htsClientRequestDto.getPersonDto() == null) throw new EntityNotFoundException(PersonDto.class, "PersonDTO is ", " empty");
            personResponseDto = personService.createPerson(htsClientRequestDto.getPersonDto());
            String personUuid = personRepository.findById(personResponseDto.getId()).get().getUuid();
            htsClient = this.htsClientRequestDtoToHtsClient(htsClientRequestDto, personUuid);
        } else {
            //already existing person
            Person person = this.getPerson(htsClientRequestDto.getPersonId());
            htsClient = this.htsClientRequestDtoToHtsClient(htsClientRequestDto, person.getUuid());
        }
        htsClient.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
        htsClient = htsClientRepository.save(htsClient);
        htsClient.getPerson();
        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClient, htsClientDto);
        BeanUtils.copyProperties(htsClient.getPerson(), htsClientDto.getPerson());

        return htsClientDto;
    }

    public HtsClientDto getHtsClientById(Long id){
        HtsClient htsClient = this.getById(id);
        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClient, htsClientDto);
        return htsClientDto;
    }
    private HtsClient getById(Long id){
        return htsClientRepository
                .findById(id)
                .orElseThrow(()-> new EntityNotFoundException(HtsClient.class, "id", ""+id));
    }

        public HtsClientDto updatePreTestCounseling(Long id, HtsPreTestCounselingDto htsPreTestCounselingDto){
        HtsClient htsClient = this.getById(id);
        if(htsClient.getPerson().getId() != htsPreTestCounselingDto.getPersonId()) throw new IllegalTypeException(Person.class, "Person", "id not match");
        htsClient.setKnowledgeAssessment(htsPreTestCounselingDto.getKnowledgeAssessment());
        htsClient.setRiskAssessment(htsPreTestCounselingDto.getRiskAssessment());
        htsClient.setTbScreening(htsPreTestCounselingDto.getTbScreening());
        htsClient.setStiScreening(htsPreTestCounselingDto.getStiScreening());

        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClientRepository.save(htsClient), htsClientDto);
        return htsClientDto;

    }

    public HtsClientDto updateHivTestResult(Long id, HtsHivTestResultDto htsHivTestResultDto){
        HtsClient htsClient = this.getById(id);
        if(htsClient.getPerson().getId() != htsHivTestResultDto.getPersonId()) throw new IllegalTypeException(Person.class, "Person", "id not match");
        htsClient.setTest1(htsHivTestResultDto.getTest1());
        htsClient.setConfirmatoryTest(htsHivTestResultDto.getConfirmatoryTest());
        htsClient.setTieBreakerTest(htsHivTestResultDto.getTieBreakerTest());
        htsClient.setHivTestResult(htsHivTestResultDto.getHivTestResult());

        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClientRepository.save(htsClient), htsClientDto);
        return htsClientDto;
    }

    public HtsClient htsClientRequestDtoToHtsClient(HtsClientRequestDto htsClientRequestDto, @NotNull String personUuid) {
        if ( htsClientRequestDto == null ) {
            return null;
        }

        HtsClient htsClient = new HtsClient();
        htsClient.setTargetGroup( htsClientRequestDto.getTargetGroup() );
        htsClient.setClientCode( htsClientRequestDto.getClientCode() );
        htsClient.setDateVisit( htsClientRequestDto.getDateVisit() );
        htsClient.setReferredFrom( htsClientRequestDto.getReferredFrom() );
        htsClient.setTestingSetting( htsClientRequestDto.getTestingSetting() );
        htsClient.setFirstTimeVisit( htsClientRequestDto.getFirstTimeVisit() );
        htsClient.setNumChildren( htsClientRequestDto.getNumChildren() );
        htsClient.setNumWives( htsClientRequestDto.getNumWives() );
        htsClient.setTypeCounseling( htsClientRequestDto.getTypeCounseling() );
        htsClient.setIndexClient( htsClientRequestDto.getIndexClient() );
        htsClient.setPreviouslyTested( htsClientRequestDto.getPreviouslyTested() );
        htsClient.setExtra( htsClientRequestDto.getExtra() );
        htsClient.setPersonUuid( personUuid);

        return htsClient;
    }

    public Person getPerson(Long personId) {
        return personRepository.findById (personId)
                .orElseThrow (() -> new EntityNotFoundException (Person.class, "id", String.valueOf (personId)));
    }


}

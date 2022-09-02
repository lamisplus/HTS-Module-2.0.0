package org.lamisplus.modules.hts.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.hts.domain.dto.*;
import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.hts.repository.HtsClientRepository;
import org.lamisplus.modules.hts.util.RandomCodeGenerator;
import org.lamisplus.modules.patient.domain.dto.PersonDto;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        Person person;
        //when it is a new person
        if(htsClientRequestDto.getPersonId() == null){
            if(htsClientRequestDto.getPersonDto() == null) throw new EntityNotFoundException(PersonDto.class, "PersonDTO is ", " empty");
            personResponseDto = personService.createPerson(htsClientRequestDto.getPersonDto());
            person = personRepository.findById(personResponseDto.getId()).get();
            String personUuid = person.getUuid();
            htsClient = this.htsClientRequestDtoToHtsClient(htsClientRequestDto, personUuid);
        } else {
            //already existing person
            person = this.getPerson(htsClientRequestDto.getPersonId());
            htsClient = this.htsClientRequestDtoToHtsClient(htsClientRequestDto, person.getUuid());
        }
        htsClient.setFacilityId(currentUserOrganizationService.getCurrentUserOrganization());
        htsClient = htsClientRepository.save(htsClient);
        htsClient.setPerson(person);
        LOG.info("Person is - {}", htsClient.getPerson());
        return this.htsClientToHtsClientDto(htsClient);
    }

    public HtsClientDtos getHtsClientById(Long id){
        List<HtsClient> htsClients = new ArrayList<>();
        htsClients.add(this.getById(id));
        return this.htsClientToHtsClientDtos(htsClients);
    }

    public HtsClientDtos getHtsClientByPersonId(Long personId){
        Person person = personRepository.findById(personId).orElse(new Person());
        if(person.getId() == null){
            return new HtsClientDtos();
        }
        return this.htsClientToHtsClientDtos(htsClientRepository.findAllByPerson(person));
    }

    private HtsClient getById(Long id){
        return htsClientRepository
                .findById(id)
                .orElseThrow(()-> new EntityNotFoundException(HtsClient.class, "id", ""+id));
    }

    public HtsClientDto updatePreTestCounseling(Long id, HtsPreTestCounselingDto htsPreTestCounselingDto){
        HtsClient htsClient = this.getById(id);
        if(!this.getPersonId(htsClient).equals(htsPreTestCounselingDto.getPersonId())) throw new IllegalTypeException(Person.class, "Person", "id not match");
        htsClient.setKnowledgeAssessment(htsPreTestCounselingDto.getKnowledgeAssessment());
        htsClient.setRiskAssessment(htsPreTestCounselingDto.getRiskAssessment());
        htsClient.setTbScreening(htsPreTestCounselingDto.getTbScreening());
        htsClient.setStiScreening(htsPreTestCounselingDto.getStiScreening());
        htsClient.setSexPartnerRiskAssessment(htsPreTestCounselingDto.getSexPartnerRiskAssessment());

        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClientRepository.save(htsClient), htsClientDto);
        return htsClientDto;

    }

    public HtsClientDto updateRequestResult(Long id, HtsRequestResultDto htsRequestResultDto){
        HtsClient htsClient = this.getById(id);
        if(!this.getPersonId(htsClient).equals( htsRequestResultDto.getPersonId())) {
            throw new IllegalTypeException(Person.class, "Person", "id not match with supplied personId");
        }

        htsClient = this.htsRequestResultDtoToHtsClient(htsClient, htsRequestResultDto);
        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClientRepository.save(htsClient), htsClientDto);
        return htsClientDto;
    }

    public HtsClientDto updateRecency(Long id, HtsRecencyDto htsRecencyDto){
        HtsClient htsClient = this.getById(id);
        if(!this.getPersonId(htsClient).equals(htsRecencyDto.getPersonId())) {
            throw new IllegalTypeException(Person.class, "Person", "id not match with supplied personId");
        }
        htsClient.setRecency(htsRecencyDto.getRecency());

        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClientRepository.save(htsClient), htsClientDto);
        return htsClientDto;
    }

    private Long getPersonId(HtsClient htsClient){
        return htsClient.getPerson().getId();
    }

    public HtsClient htsRequestResultDtoToHtsClient(HtsClient updatableHtsClient, HtsRequestResultDto htsRequestResultDto){
        updatableHtsClient.setTest1(htsRequestResultDto.getTest1());
        updatableHtsClient.setConfirmatoryTest(htsRequestResultDto.getConfirmatoryTest());
        updatableHtsClient.setTieBreakerTest(htsRequestResultDto.getTieBreakerTest());
        updatableHtsClient.setHivTestResult(htsRequestResultDto.getHivTestResult());
        updatableHtsClient.setSyphilisTesting(htsRequestResultDto.getSyphilisTesting());
        updatableHtsClient.setHepatitisTesting(htsRequestResultDto.getHepatitisTesting());
        updatableHtsClient.setOthers(htsRequestResultDto.getOthers());
        updatableHtsClient.setCd4(htsRequestResultDto.getCd4());

        return updatableHtsClient;
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
        htsClient.setPregnant(htsClientRequestDto.getPregnant());
        htsClient.setBreastFeeding(htsClientRequestDto.getBreastFeeding());
        htsClient.setRelationWithIndexClient(htsClientRequestDto.getRelationWithIndexClient());

        return htsClient;
    }

    public Person getPerson(Long personId) {
        return personRepository.findById (personId)
                .orElseThrow (() -> new EntityNotFoundException (Person.class, "id", String.valueOf (personId)));
    }

    private HtsClient htsClientRequestDtoToHtsClient(HtsClientRequestDto htsClientRequestDto) {
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
        htsClient.setPregnant( htsClientRequestDto.getPregnant() );
        htsClient.setBreastFeeding( htsClientRequestDto.getBreastFeeding() );
        htsClient.setRelationWithIndexClient( htsClientRequestDto.getRelationWithIndexClient() );

        return htsClient;
    }

    public HtsClientDtos getAllHtsClientDtos(Page<HtsClient> page, List<HtsClient> clients){
        if(page != null && !page.isEmpty()){
            return htsClientToHtsClientDtos(page.stream().collect(Collectors.toList()));
        } else if(clients != null && !clients.isEmpty()){
            return htsClientToHtsClientDtos(clients);
        }
        return null;
    }

    private HtsClientDtos htsClientToHtsClientDtos(List<HtsClient> clients){
        final Long[] pId = {null};
        final PersonResponseDto[] personResponseDto = {new PersonResponseDto()};
        HtsClientDtos htsClientDtos = new HtsClientDtos();
        List<HtsClientDto> htsClientDtoList =  clients
                .stream()
                .map(htsClient1 -> {
                    if(pId[0] == null) {
                        Person person = htsClient1.getPerson();
                        pId[0] = person.getId();
                        personResponseDto[0] = personService.getDtoFromPerson(person);
                    }
                    return this.htsClientToHtsClientDto(htsClient1);})
                .collect(Collectors.toList());
        htsClientDtos.setHtsCount(htsClientDtoList.size());
        htsClientDtos.setHtsClientDtoList(htsClientDtoList);
        htsClientDtos.setPersonId(pId[0]);
        htsClientDtos.setPersonResponseDto(personResponseDto[0]);
        return htsClientDtos;
    }

    private HtsClientDto htsClientToHtsClientDto(HtsClient htsClient) {
        if ( htsClient == null ) {
            return null;
        }

        HtsClientDto htsClientDto = new HtsClientDto();

        htsClientDto.setId( htsClient.getId() );
        htsClientDto.setTargetGroup( htsClient.getTargetGroup() );
        htsClientDto.setClientCode( htsClient.getClientCode() );
        htsClientDto.setDateVisit( htsClient.getDateVisit() );
        htsClientDto.setReferredFrom( htsClient.getReferredFrom() );
        htsClientDto.setTestingSetting( htsClient.getTestingSetting() );
        htsClientDto.setFirstTimeVisit( htsClient.getFirstTimeVisit() );
        htsClientDto.setNumChildren( htsClient.getNumChildren() );
        htsClientDto.setNumWives( htsClient.getNumWives() );
        htsClientDto.setTypeCounseling( htsClient.getTypeCounseling() );
        htsClientDto.setIndexClient( htsClient.getIndexClient() );
        htsClientDto.setPreviouslyTested( htsClient.getPreviouslyTested() );
        //LOG.info("Person in transform {}", htsClient.getPerson());
        PersonResponseDto personResponseDto = personService.getDtoFromPerson(htsClient.getPerson());
        htsClientDto.setPersonResponseDto(personResponseDto);
        htsClientDto.setExtra( htsClient.getExtra() );
        htsClientDto.setPregnant( htsClient.getPregnant() );
        htsClientDto.setBreastFeeding( htsClient.getBreastFeeding() );
        htsClientDto.setRelationWithIndexClient( htsClient.getRelationWithIndexClient() );
        htsClientDto.setCapturedBy( htsClient.getCapturedBy() );
        htsClientDto.setRecency( htsClient.getRecency());
        htsClientDto.setKnowledgeAssessment( htsClient.getKnowledgeAssessment() );
        htsClientDto.setRiskAssessment( htsClient.getRiskAssessment() );
        htsClientDto.setTbScreening( htsClient.getTbScreening() );
        htsClientDto.setStiScreening( htsClient.getStiScreening() );
        htsClientDto.setTest1( htsClient.getTest1() );
        htsClientDto.setConfirmatoryTest( htsClient.getConfirmatoryTest() );
        htsClientDto.setTieBreakerTest( htsClient.getTieBreakerTest() );
        htsClientDto.setHivTestResult( htsClient.getHivTestResult() );
        htsClientDto.setPersonId(personResponseDto.getId());
        htsClientDto.setPostTestCounselingKnowledgeAssessment(htsClient.getPostTestCounselingKnowledgeAssessment());
        htsClientDto.setRecency(htsClient.getRecency());
        htsClientDto.setSyphilisTesting(htsClient.getSyphilisTesting());
        htsClientDto.setCd4(htsClient.getCd4());
        htsClientDto.setSexPartnerRiskAssessment(htsClient.getSexPartnerRiskAssessment());
        htsClientDto.setOthers(htsClient.getOthers());
        htsClientDto.setHepatitisTesting(htsClient.getHepatitisTesting());

        return htsClientDto;
    }

    public Page<HtsClient> findHtsClientPage(Pageable pageable) {
        return htsClientRepository.findAll(pageable);
    }

    public HtsClientDtos getAllHtsClientDtos(Page<HtsClient> page) {
        return getAllHtsClientDtos(page, null);
    }

    public List<HtsClientDtos> getAllPatients(){
        List<HtsClientDtos> htsClientDtosList = new ArrayList<>();
        for(PersonResponseDto personResponseDto :personService.getAllPerson()){
            Person person = this.getPerson(personResponseDto.getId());
            List<HtsClient> clients = htsClientRepository.findAllByPersonOrderByIdDesc(person);
            HtsClientDtos htsClientDtos = new HtsClientDtos();
            if(clients.isEmpty()){
                htsClientDtos.setHtsClientDtoList(new ArrayList<>());
                htsClientDtos.setHtsCount(0);
                htsClientDtos.setPersonResponseDto(personResponseDto);
                htsClientDtos.setPersonId(personResponseDto.getId());
                htsClientDtosList.add(htsClientDtos);
                //LOG.info("hts client is {}", htsClientDtos.getHtsCount());
            } else {
                htsClientDtosList.add(htsClientToHtsClientDtos(clients));
                //LOG.info("hts client is {}", clients.size());
            }

        }

        /*personService.getAllPerson().stream().map(personResponseDto -> {
            Person person = this.getPerson(personResponseDto.getId());
            List<HtsClient> clients = htsClientRepository.findAllByPerson(person);
            HtsClientDtos htsClientDtos = new HtsClientDtos();
            if(clients.isEmpty()){
                htsClientDtos.setHtsClientDtoList(new ArrayList<>());
                htsClientDtos.setHtsCount(0);
                htsClientDtos.setPersonResponseDto(personResponseDto);
                htsClientDtosList.add(htsClientDtos);
            } else {
                htsClientDtosList.add(htsClientToHtsClientDtos(clients));
            }
            return htsClientDtosList;
            });*/

        return htsClientDtosList;
    }

    public HtsClientDto updatePostTestCounselingKnowledgeAssessment(Long id, PostTestCounselingDto postTestCounselingDto){
        HtsClient htsClient = this.getById(id);
        if(htsClient.getPerson().getId() != postTestCounselingDto.getPersonId()) throw new IllegalTypeException(Person.class, "Person", "id not match");
        htsClient.setPostTestCounselingKnowledgeAssessment(postTestCounselingDto.getPostTestCounselingKnowledgeAssessment());

        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClientRepository.save(htsClient), htsClientDto);
        return htsClientDto;
    }

    public HtsClientDto updateIndexNotificationServicesElicitation(Long id, IndexNotificationServicesElicitationDto indexNotificationServicesElicitationDto){
        HtsClient htsClient = this.getById(id);
        if(htsClient.getPerson().getId() != indexNotificationServicesElicitationDto.getPersonId()) throw new IllegalTypeException(Person.class, "Person", "id not match");
        htsClient.setIndexNotificationServicesElicitation(indexNotificationServicesElicitationDto
                        .getIndexNotificationServicesElicitation());

        HtsClientDto htsClientDto = new HtsClientDto();
        BeanUtils.copyProperties(htsClientRepository.save(htsClient), htsClientDto);
        return htsClientDto;
    }

    public String getHtsClientCode(){
        Optional<Long> number = htsClientRepository.maxId();
        String random = RandomCodeGenerator.randomString(10, true, true);
        if(number.isPresent()){
            return number.get() + random;
        }
        return 1 + random;
    }
}

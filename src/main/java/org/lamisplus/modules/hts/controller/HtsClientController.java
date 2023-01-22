package org.lamisplus.modules.hts.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.dto.PageDTO;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.lamisplus.modules.hts.domain.dto.*;
import org.lamisplus.modules.hts.domain.entity.HtsPerson;
import org.lamisplus.modules.hts.service.HtsClientService;
import org.lamisplus.modules.hts.service.IndexElicitationService;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class HtsClientController {
    private final HtsClientService htsClientService;
    private final String HTS_URL_VERSION_ONE = "/api/v1/hts";
    private final String HTS_URL_VERSION_TWO = "/api/v2/hts";

    private final IndexElicitationService indexElicitationService;

    @PostMapping(HTS_URL_VERSION_ONE)
    public ResponseEntity<HtsClientDto> save(@Valid @RequestBody HtsClientRequestDto htsClientRequestDto) {
        return ResponseEntity.ok(this.htsClientService.save(htsClientRequestDto));
    }

    @PutMapping(HTS_URL_VERSION_ONE +"/{id}")
    public ResponseEntity<HtsClientDto> update(@PathVariable Long id, @Valid @RequestBody HtsClientUpdateRequestDto htsClientUpdateRequestDto) {
        return ResponseEntity.ok(this.htsClientService.update(id, htsClientUpdateRequestDto));
    }

    @PutMapping(HTS_URL_VERSION_ONE +"/{id}/pre-test-counseling")
    public ResponseEntity<HtsClientDto> updatePreTestCounseling(@PathVariable Long id, @Valid @RequestBody HtsPreTestCounselingDto htsPreTestCounselingDto) {
        return ResponseEntity.ok(this.htsClientService.updatePreTestCounseling(id, htsPreTestCounselingDto));
    }
    @PutMapping(HTS_URL_VERSION_ONE +"/{id}/recency")
    public ResponseEntity<HtsClientDto> updateRecency(@PathVariable Long id, @Valid @RequestBody HtsRecencyDto htsRecencyDto) {
        return ResponseEntity.ok(this.htsClientService.updateRecency(id, htsRecencyDto));
    }
    @PutMapping(HTS_URL_VERSION_ONE +"/{id}/request-result")
    public ResponseEntity<HtsClientDto> updateRequestResult(@PathVariable Long id, @Valid @RequestBody HtsRequestResultDto htsRequestResultDto) {
        return ResponseEntity.ok(this.htsClientService.updateRequestResult(id, htsRequestResultDto));
    }
    @PutMapping(HTS_URL_VERSION_ONE +"/{id}/post-test-counseling")
    public ResponseEntity<HtsClientDto> updatePostTestCounselingKnowledgeAssessment(@PathVariable Long id, @Valid @RequestBody PostTestCounselingDto postTestCounselingDto) {
        return ResponseEntity.ok(this.htsClientService.updatePostTestCounselingKnowledgeAssessment(id, postTestCounselingDto));
    }
    /*@PutMapping(HTS_URL_VERSION_ONE +"/{id}/index-notification-services-elicitation")
    public ResponseEntity<HtsClientDto> updateIndexNotificationServicesElicitation(@PathVariable Long id, @Valid @RequestBody IndexElicitationDto indexElicitationDto) {
        return ResponseEntity.ok(this.htsClientService.updateIndexNotificationServicesElicitation(id, indexElicitationDto));
    }*/
    /*@GetMapping(HTS_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<HtsClientDtos> getHtsClientById(@PathVariable Long id) {
        return ResponseEntity.ok(this.htsClientService.getHtsClientById(id));
    }*/
    @GetMapping(HTS_URL_VERSION_ONE + "/{id}/index-elicitation")
    public ResponseEntity<List<IndexElicitationResponseDto>> getAllByHtsClientId(@PathVariable Long id) {
        return ResponseEntity.ok(this.indexElicitationService.getAllByHtsClientId(id));
    }
    @GetMapping(HTS_URL_VERSION_ONE + "/persons/{personId}")
    public ResponseEntity<HtsClientDtos> getHtsClientByPersonId(@PathVariable Long personId) {
        return ResponseEntity.ok(this.htsClientService.getHtsClientByPersonId(personId));
    }
    @GetMapping(HTS_URL_VERSION_ONE + "/persons/{personId}/current-hts")
    public ResponseEntity<HtsClientDto> getLatestHtsByPersonId(@PathVariable Long personId) {
        return ResponseEntity.ok(this.htsClientService.getLatestHtsByPersonId(personId));
    }

    @GetMapping(HTS_URL_VERSION_ONE + "/code/client-code")
    public ResponseEntity<String> getGenerateHtsClientCode() {
        return ResponseEntity.ok(this.htsClientService.getGenerateHtsClientCode());
    }
    @GetMapping(HTS_URL_VERSION_ONE + "/client/{code}")
    public ResponseEntity<String> getClientNameByCode(@PathVariable String code) {
        return ResponseEntity.ok(this.htsClientService.getClientNameByCode(code));
    }
    @GetMapping(HTS_URL_VERSION_ONE)
    public ResponseEntity<PageDTO> getHtsClients(@RequestParam (required = false, defaultValue = "*")  String searchValue,
                                                 @RequestParam (required = false, defaultValue = "20")int pageSize,
                                                 @RequestParam (required = false, defaultValue = "0") int pageNo) {
        Page<Person> page = htsClientService.findHtsClientPersonPage(searchValue, pageNo, pageSize);
        //HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(this.htsClientService.getAllHtsClientDTOSByPerson(page), HttpStatus.OK);
    }
    @GetMapping(HTS_URL_VERSION_ONE + "/persons")
    public ResponseEntity<PageDTO> getHtsPerson(@RequestParam (required = false, defaultValue = "*")  String searchValue,
                                                 @RequestParam (required = false, defaultValue = "20")int pageSize,
                                                 @RequestParam (required = false, defaultValue = "0") int pageNo) {
        Page<HtsPerson> page = htsClientService.getAllPersonHts(searchValue, pageNo, pageSize);
        return new ResponseEntity<>(PaginationUtil.generatePagination(page, page.getContent()), HttpStatus.OK);
    }
    @GetMapping(HTS_URL_VERSION_ONE+ "/risk-stratification/person/{personId}")
    public ResponseEntity<HtsClientDtos> getRiskStratificationHtsClients(@PathVariable Long personId) {
        return ResponseEntity.ok(htsClientService.getRiskStratificationHtsClients(personId));
    }
    /*@GetMapping(HTS_URL_VERSION_ONE + "/persons")
    public ResponseEntity<PageDTO> getAllPerson(@RequestParam (required = false, defaultValue = "*")  String searchValue,
                                                @RequestParam (required = false, defaultValue = "20")int pageSize,
                                                @RequestParam (required = false, defaultValue = "0") int pageNo) {
        return new ResponseEntity<>(this.htsClientService
                .getAllHtsClientDTOSByPerson(htsClientService
                        .findHtsClientPersonPage(searchValue, pageNo, pageSize)), HttpStatus.OK);
    }*/
    @DeleteMapping(HTS_URL_VERSION_ONE + "/{id}")
    public void delete(@PathVariable Long id) {
        this.htsClientService.delete(id);
    }
}

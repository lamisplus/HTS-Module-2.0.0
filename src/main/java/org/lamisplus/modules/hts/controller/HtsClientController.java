package org.lamisplus.modules.hts.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.hts.domain.dto.*;
import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.hts.service.HtsClientService;
import org.lamisplus.modules.hts.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class HtsClientController {
    private final HtsClientService htsClientService;
    private final String BASE_URL_VERSION_ONE = "/api/v1/hts";

    @PostMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<HtsClientDto> save(@Valid @RequestBody HtsClientRequestDto htsClientRequestDto) {
        return ResponseEntity.ok(this.htsClientService.save(htsClientRequestDto));
    }

    @PutMapping(BASE_URL_VERSION_ONE+"/{id}/pre-test-counseling")
    public ResponseEntity<HtsClientDto> updatePreTestCounseling(@PathVariable Long id, @Valid @RequestBody HtsPreTestCounselingDto htsPreTestCounselingDto) {
        return ResponseEntity.ok(this.htsClientService.updatePreTestCounseling(id, htsPreTestCounselingDto));
    }

    @PutMapping(BASE_URL_VERSION_ONE+"/{id}/hiv-test-result")
    public ResponseEntity<HtsClientDto> updateHivTestResult(@PathVariable Long id, @Valid @RequestBody HtsHivTestResultDto htsHivTestResultDto) {
        return ResponseEntity.ok(this.htsClientService.updateHivTestResult(id, htsHivTestResultDto));
    }
    @GetMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<HtsClientDto> getHtsClientById(@PathVariable Long id) {
        return ResponseEntity.ok(this.htsClientService.getHtsClientById(id));
    }
    @GetMapping(BASE_URL_VERSION_ONE + "/persons/{personId}")
    public ResponseEntity<HtsClientDtos> getHtsClientByPersonId(@PathVariable Long personId) {
        return ResponseEntity.ok(this.htsClientService.getHtsClientByPersonId(personId));
    }

    @GetMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<HtsClientDtos> getHtsClients(@PageableDefault(value = 50) Pageable pageable) {
        Page<HtsClient> page = htsClientService.findHtsClientPage(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(this.htsClientService.getAllHtsClientDtos(page, null), headers, HttpStatus.OK);
    }
}

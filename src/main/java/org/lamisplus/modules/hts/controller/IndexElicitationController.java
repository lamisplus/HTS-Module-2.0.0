package org.lamisplus.modules.hts.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hts.domain.dto.*;
import org.lamisplus.modules.hts.domain.entity.HtsClient;
import org.lamisplus.modules.hts.domain.entity.IndexElicitation;
import org.lamisplus.modules.hts.service.HtsClientService;
import org.lamisplus.modules.hts.service.IndexElicitationService;
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
public class IndexElicitationController {
    private final IndexElicitationService indexElicitationService;
    private final String INDEX_ELICITATION_URL_VERSION_ONE = "/api/v1/index-elicitation";

    @PostMapping(INDEX_ELICITATION_URL_VERSION_ONE)
    public ResponseEntity<IndexElicitationResponseDto> save(@Valid @RequestBody IndexElicitationDto indexElicitationDto) {
        return ResponseEntity.ok(this.indexElicitationService.save(indexElicitationDto));
    }

    @GetMapping(INDEX_ELICITATION_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<IndexElicitationResponseDto> getIndexElicitationById(@PathVariable Long id) {
        return ResponseEntity.ok(this.indexElicitationService.getIndexElicitationById(id));
    }

    @PutMapping(INDEX_ELICITATION_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<IndexElicitationResponseDto> update(@PathVariable Long id, @Valid @RequestBody IndexElicitationResponseDto indexElicitationResponseDto) {
        return ResponseEntity.ok(this.indexElicitationService.update(id, indexElicitationResponseDto));
    }

    @DeleteMapping(INDEX_ELICITATION_URL_VERSION_ONE + "/{id}")
    public void delete(@PathVariable Long id) {
        this.indexElicitationService.delete(id);
    }
}
